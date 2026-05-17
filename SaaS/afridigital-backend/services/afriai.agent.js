const memoryStore = global.__AFRIAI_MEMORY__ || (global.__AFRIAI_MEMORY__ = {});

async function afriaiAgent({ input, user }) {

  if (!memoryStore[user]) memoryStore[user] = [];

  memoryStore[user].push({ role: "user", text: input, ts: Date.now() });

  const context = memoryStore[user]
    .slice(-10)
    .map(m => `${m.role}: ${m.text}`)
    .join("\n");

  const replyText =
`🤖 AfriAI (RENDER LIVE)

${context}

Reply: ${input}`;

  memoryStore[user].push({ role: "ai", text: replyText, ts: Date.now() });

  return {
    text: replyText,
    user,
    memorySize: memoryStore[user].length
  };
}

module.exports = afriaiAgent;
