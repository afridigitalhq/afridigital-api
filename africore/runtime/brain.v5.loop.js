const cron = require("node-cron");
const goals = require("./brain.v5.goals");
const tasks = require("./brain.v5.tasks");
const mesh = require("./brain.v5.mesh");

function startBrainLoop() {

  cron.schedule("*/1 * * * *", async () => {

    console.log("🧠 v5 Brain cycle running...");

    const activeGoals = await goals.getGoals();

    // generate internal optimization task
    if (activeGoals.length > 0) {
      await tasks.addTask({
        type: "optimize",
        goal: activeGoals[0].name,
        priority: "auto"
      });
    }

    // broadcast system heartbeat
    mesh.send("brain", "fraud-agent", { action: "scan" });
    mesh.send("brain", "sales-agent", { action: "optimize" });
    mesh.send("brain", "support-agent", { action: "check" });

  });
}

module.exports = { startBrainLoop };
