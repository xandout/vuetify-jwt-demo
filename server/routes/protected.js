const controller = require('../controllers/protected');
// const validateToken = require('../middleware/jwt').validateToken;

module.exports = (router) => {
    router.route('/protected')
      .get( controller.get);
    router.route('/unprotected')
      .get((req, res) => {
        res.status(200).send("ok")
      })
}