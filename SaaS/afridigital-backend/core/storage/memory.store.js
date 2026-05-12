const { assertApiVersion } = require("../runtime/safety/api.guard");
const memory = {
  users: [],
  sessions: [],
  analytics: []
};

module.exports = memory;
