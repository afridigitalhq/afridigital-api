const bus = require("../v15/bus.cjs");
const { emit } = require("../events/spine.cjs");

function train() {
  console.log("\n🧠 AI TRAINING CYCLE START");

  const logs = bus.marketplace.jobs.length + bus.marketplace.ads.length;

  bus.ai.last_training = Date.now();

  emit("AI_TRAINED", {
    dataset_size: logs,
    time: bus.ai.last_training
  });

  console.log("✅ AI UPDATED FROM PLATFORM LOGS");
}

function respond(query) {
  if (query.includes("job")) {
    return bus.marketplace.jobs.slice(-5);
  }

  if (query.includes("earn") || query.includes("ads")) {
    return bus.marketplace.ads.slice(-5);
  }

  return "No matching economic opportunity found.";
}

module.exports = { train, respond };
