const users = require('./users');
const protected_route = require('./protected');

module.exports = (router) => {
  users(router);
  protected_route(router);

  return router;
};