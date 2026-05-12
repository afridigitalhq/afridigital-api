const { assertApiVersion } = require("../runtime/safety/api.guard");
const state = {};

module.exports = {
  set: (k, v) => state[k] = v,
  get: (k) => state[k]
};
