const bus = require("../redis/streamBus");
const redis = require("../redis/client");

/**
 * STREAM CHANNELS (Redis PubSub)
 */
const CHANNEL = "afriai:tokens";

/**
 * publish token to stream
 */
async function publishToken(sessionId, token) {
  await redis.publish(CHANNEL, JSON.stringify({
    sessionId,
    token
  }));
}

/**
 * subscribe stream
 */
function subscribeStream(handler) {
  const sub = redis.duplicate();

  sub.subscribe(CHANNEL);

  sub.on("message", (channel, msg) => {
    const data = JSON.parse(msg);
    handler(data);
  });

  return sub;
}

module.exports = {
  publishToken,
  subscribeStream
};
