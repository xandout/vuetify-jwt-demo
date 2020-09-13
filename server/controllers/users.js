const User = require('../models/users');
const bcrypt = require('bcrypt');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
let APIResponse = require('../classes/apiresponse')

// https://github.com/angular/angular/blob/c90eb5450d8e2089145f1c9506fb787760e5d682/packages/forms/src/validators.ts#L98
const email_regex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
  add: (req, res) => {
    let ret = new APIResponse()
    
    // test that email passes regex test before continuing
    if (!email_regex.test(req.body.email)) {
      ret.status = 400
      ret.message = `${req.body.email} is not a valid email address`
    }
    const user = new User({
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }); 
    user.password = bcrypt.hashSync(req.body.password, stage.saltingRounds)
    user.save(saveErr => {
      if (!saveErr) {
        ret.message = `New user ${user.email} added`
      } else if (saveErr.code === 11000) {
        // Duplicate user
        ret.status = 409
        ret.message = `User ${user.email} already exists`
      } else {
        ret.status = 500;
        ret.message = saveErr
      }
      res.status(ret.status).send(ret);
    });

  },
  login: (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    let ret = new APIResponse()
    User.findOne({ email }, (findErr, user) => {
      if (!findErr && user) {
        let match = bcrypt.compareSync(pass, user.password)
        if (match) {
          req.session.user_id = user.id
        } else {
          ret.status = 401;
          ret.message = `Invalid login for ${email}`
        }
        res.status(ret.status).send(ret);
      } else if (!findErr && !user) {
        // User not found
        ret.status = 404;
        ret.message = `User ${email} not found`
        res.status(ret.status).send(ret);
      } else {
        // Internal error with mongo
        ret.status = 500
        ret.message = findErr
        res.status(ret.status).send(ret)
      }
    })
  },
  logout: (req, res) => {
    let ret = new APIResponse()
    req.session.destroy(_ => {
      res.status(ret.status).send(ret)
    })
  },
  whoAmI: (req, res) => {
    let ret = new APIResponse()
    let user = req.session.user_id;
    User.findById({ _id: user }, 'email first_name last_name', (findUserErr, foundUser) => {
      if (!findUserErr && foundUser) {
        ret.data = foundUser
      } else {
        ret.status = 404
        ret.errors.push(findUserErr)
      }
      res.status(ret.status).send(ret)
    })
  },
  update: (req, res) => {
    let ret = new APIResponse()
    let user = req.session.user_id;
    let new_first_name = req.body.first_name;
    let new_last_name = req.body.last_name;
    let new_email = req.body.email;
    let new_password = req.body.password;
    // hash the new password if set
    if (new_password) {
      new_password = bcrypt.hashSync(new_password, stage.saltingRounds)
    }
    User.findById({ _id: user }, 'email first_name last_name password', (findUserErr, foundUser) => {
      if (!findUserErr && foundUser) {
        foundUser.email = new_email ? new_email : foundUser.email;
        foundUser.first_name = new_first_name ? new_first_name : foundUser.first_name;
        foundUser.last_name = new_last_name ? new_last_name : foundUser.last_name;
        foundUser.password = new_password ? new_password : foundUser.password;
        foundUser.save(updateUserErr => {
          if (updateUserErr) {
            ret.status = 500
            ret.message = updateUserErr
          }
          res.status(ret.status).send(ret)
          return // Done updating
        })
      } else {
        ret.status = 404
        ret.message = `User not found`
        res.status(ret.status).send(ret)
      }
    })
  },
  isLoggedIn: (req, res) => {
    let ret = new APIResponse()
    if (!req.session.user_id) {
      ret.status = 401
      ret.message = "You are not logged in"
    }
    res.status(ret.status).send(ret)
  }
}