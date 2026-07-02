const swarm = ;
const memory = require("./memory.brain");

async function startMemorySwarm() {
  console.log("🧠 Memory Swarm ACTIVE");

  await swarm.listen("memory-group", "agent-1", async (msg) => {

    const history = await memory.recall(msg.from || "global");

    console.log("📚 Context size:", history.length);

    await swarm.broadcast("memory.processed", {
      from: msg.from,
      contextSize: history.length
    });
  });
}

module.exports = { startMemorySwarm };
