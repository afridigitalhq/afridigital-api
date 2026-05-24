const memory = require("./memory.brain.v1");

async function inspect(user) {
  const data = await memory.getMemory(user);

  console.log("🧠 MEMORY INSPECT:", {
    user: data.user,
    messages: data.totalMessages,
    value: data.valueScore,
    lastRoute: data.lastRoute
  });

  return data;
}

module.exports = { inspect };
