const EventEmitter = require("events");

let redisClient = null;

/**
 * Optional Redis injection (safe plug-in design)
 */
function attachRedis(client) {
  redisClient = client;
}

/**
 * Tokenizer (lightweight, no dependencies)
 */
function tokenize(text) {
  return text.split(" ");
}

/**
 * STREAM CORE ENGINE
 * - emits tokens one-by-one
 * - pushes to Redis if available
 * - emits local events for SSE / WhatsApp bridge
 */
class StreamCore extends EventEmitter {
  constructor() {
    super();
  }

  async streamText({ id, text, delay = 50 }) {
    const tokens = tokenize(text);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      const payload = {
        id,
        token,
        index: i,
        done: i === tokens.length - 1,
        ts: Date.now()
      };

      // 1. Emit locally (SSE / websocket bridge)
      this.emit("token", payload);

      // 2. Push to Redis stream (if connected)
      if (redisClient) {
        try {
          await redisClient.xAdd("ai:stream", "*", payload);
        } catch (e) {
          // fail silently (stream must not crash system)
        }
      }

      await new Promise(r => setTimeout(r, delay));
    }

    this.emit("done", { id, total: tokens.length });
  }
}

module.exports = {
  StreamCore,
  attachRedis
};
