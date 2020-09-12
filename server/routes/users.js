const controller = require('../controllers/users');

module.exports = (router) => {
  router.route('/register')
    .post(controller.add);

  router.route('/login')
    .post(controller.login)

  router.route('/logout')
    .get(controller.logout)

  router.route('/whoami')
    .get(controller.whoAmI)

  router.route('/valid')
    .get(controller.isLoggedIn)
};