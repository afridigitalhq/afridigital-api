const redis = require("../redis/client");

const CHANNEL = "afriai:typing";

async function emitTyping(sessionId, state) {
  await redis.publish(CHANNEL, JSON.stringify({
    sessionId,
    state
  }));
}

module.exports = { emitTyping };
