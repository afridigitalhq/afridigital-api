const { economyBrain } = require("./brain.economy");

async function AfriAI(input, context = {}) {

  const channel = context.channel || "web";
  const userId = context.userId || "demo-user";

  // STEP 1: Pass through economy brain
  const result = await economyBrain(input, userId);

  // STEP 2: Attach channel metadata
  return {
    ...result,
    channel,
    timestamp: Date.now()
  };
}

module.exports = { AfriAI };
