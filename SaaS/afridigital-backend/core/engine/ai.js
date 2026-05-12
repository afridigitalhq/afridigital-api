const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  parse: async (msg) => {
    return { type: "general", raw: msg };
  }
};
