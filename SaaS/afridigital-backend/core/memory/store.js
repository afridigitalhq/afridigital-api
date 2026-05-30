const redis = require("../redis");

const TTL = 60 * 60 * 24 * 7;

const key = (id) => `afriai:mem:${id}`;

async function getUser(userId) {
  const data = await redis.get(key(userId));
  return data ? JSON.parse(data) : { messages: [] };
}

async function pushMessage(userId, msg) {
  const user = await getUser(userId);

  user.messages.push({
    text: msg.text,
    ts: Date.now()
  });

  if (user.messages.length > 20) {
    user.messages = user.messages.slice(-20);
  }

  await redis.set(
    key(userId),
    JSON.stringify(user),
    "EX",
    TTL
  );

  return user;
}

/**
 * 🧠 Compatibility adapter
 * orchestration layer expects getContext()
 */
async function getContext(userId) {
  return await getUser(userId);
}

module.exports = {
  getUser,
  pushMessage,
  getContext
};
