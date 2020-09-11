const controller = require('../controllers/users');
const validateToken = require('../middleware/jwt').validateToken;

module.exports = (router) => {
  router.route('/register')
    .post(controller.add);
  
  router.route('/login')
    .post(controller.login)
  
    router.route('/whoami')
      .get(validateToken, controller.whoAmI)
};