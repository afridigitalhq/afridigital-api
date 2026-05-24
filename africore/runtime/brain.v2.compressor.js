const brain = require("./brain.v2.memory");

// simple compression engine (upgrade later to LLM summarizer)
async function compress(user) {
  const data = await brain.recall(user);

  const summary = data.messages
    .slice(0, 10)
    .map(m => m.msg)
    .join(" | ")
    .slice(0, 300);

  await brain.storeSummary(user, summary);

  return summary;
}

module.exports = { compress };
