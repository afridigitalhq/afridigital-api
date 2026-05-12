const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  scan: () => {
    return {
      cpu: Math.random(),
      memory: Math.random(),
      traffic: Math.random()
    };
  }
};
