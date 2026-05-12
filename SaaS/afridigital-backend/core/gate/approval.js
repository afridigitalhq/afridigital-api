const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {
  approve: (result) => {
    console.log("🛡️ Gate check:", result);
    return result.safe === true;
  }
};
