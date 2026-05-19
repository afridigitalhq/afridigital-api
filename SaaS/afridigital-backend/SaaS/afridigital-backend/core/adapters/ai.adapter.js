const { assertApiVersion } = require("../runtime/safety/api.guard");
class AIAdapter {
  predict(input) {
    return {
      score: 0,
      status: "SAFE_MODE",
      input
    };
  }
}
module.exports = new AIAdapter();
