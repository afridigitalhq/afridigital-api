const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  approve: (result) => {
    console.log("🛡️ Guard evaluating:", result);
    return result.success === true;
  }
};
