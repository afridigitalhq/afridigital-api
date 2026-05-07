const ai = require("../ai/engine.cjs");

function startLearningLoop() {
  console.log("\n🔁 AI SELF-LEARNING LOOP ACTIVE (60 MIN)");

  setInterval(() => {
    ai.train();
  }, 60 * 60 * 1000);
}

module.exports = { startLearningLoop };
