const route = require("../routing.brain");

module.exports = function resolve(intent) {
  return route(intent);
};
