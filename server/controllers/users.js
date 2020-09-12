const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// https://github.com/angular/angular/blob/c90eb5450d8e2089145f1c9506fb787760e5d682/packages/forms/src/validators.ts#L98
const email_regex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

module.exports = {
  add: (req, res) => {
    let result = {};
    let status = 201;
    // test that email passes regex test before continuing
    if (!email_regex.test(req.body.email)) {
      status = 400
      result.error = `${req.body.email} is not a valid email address`
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }); // document = instance of a model
    bcrypt.hash(user.password, stage.saltingRounds, function (hashErr, hash) {
      if (hashErr) {
        console.log('Error hashing password for user', user.email);
        status = 500
        result.status = status
        result.error = hashErr
        res.status(status).send(result)
      } else {
        user.password = hash;
        user.save(saveErr => {
          if (!saveErr) {
            result.status = status;
            result.message = "ok"
          } else if (saveErr.code === 11000) {
            // Duplicate user
            status = 409
            result.status = status
            result.error = "user already exists"
          } else {
            status = 500;
            result.status = status;
            result.error = saveErr;
          }
          res.status(status).send(result);
        });
      }
    })
  },
  login: (req, res) => {
    const email = req.body.email;
    const pass = req.body.password;
    let result = {};
    let status = 200;
    console.log("Called login")
    User.findOne({ email }, (findErr, user) => {
      if (!findErr && user) {
        // We could compare passwords in our model instead of below
        bcrypt.compare(pass, user.password).then(match => {
          if (match) {
            result.status = status;
            req.session.user_id = user.id
          } else {
            status = 401;
            result.status = status;
            result.error = 'Authentication error';
          }
          res.status(status).send(result);
        }).catch(hashCompareErr => {
          status = 500;
          result.status = status;
          result.error = hashCompareErr;
          res.status(status).send(result);
        });
      } else if (!findErr && !user) {
        // User not found
        status = 404;
        result.status = status;
        result.error = "user not found";
        res.status(status).send(result);
      } else {
        // Internal error with mongo
        status = 500
        result.error = findErr
        res.status(status).send(result)
      }
    })
  },
  logout: (req, res) => {
    req.session.destroy(err => {
      res.status(200).send({ status: "ok" })
    })
  },
  whoAmI: (req, res) => {
    let result = {};
    let status = 200;
    let user = req.session.user_id;
    User.findById({ _id: user }, '_id email first_name last_name', (findUserErr, foundUser) => {
      if (!findUserErr && foundUser) {
        result.id = foundUser._id
        result.email = foundUser.email
        result.first_name = foundUser.first_name
        result.last_name = foundUser.last_name
      } else {
        status = 404
        result.error = findUserErr
      }
      res.status(status).send(result)
    })
  },
  isLoggedIn: (req, res) => {
    let status = 200
    let result = {}
    if (req.session.user_id) {
      result.status = "ok"
    } else {
      result.status = "no"
    }
    res.status(status).send(result)
  }
}