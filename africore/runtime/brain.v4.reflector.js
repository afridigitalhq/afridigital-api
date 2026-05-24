const cron = require("node-cron");
const reward = require("./brain.v4.reward");
const agents = require("./brain.v4.agents");

function startReflection() {

  cron.schedule("*/5 * * * *", async () => {

    console.log("🧠 v4 Reflection cycle running...");

    // simulate global adjustment cycle
    await agents.adjustWeights("global");

  });
}

module.exports = { startReflection };
