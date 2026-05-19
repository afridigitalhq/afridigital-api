const { assertApiVersion } = require("../runtime/safety/api.guard");
const { execute } = require("../afrios.execution.unifier");

// 🧠 ALL MESSAGES NOW GO THROUGH ONE BRAIN ONLY
function runtimeEngine(message) {
  return execute(message);
}

module.exports = {
  runtimeEngine
};
