const bus = require("../redis/streamBus");
const redis = require("../redis/client");
const { sendWhatsAppMessage } = require("./gateway");

const CHANNEL = "afriai:tokens";

/**
 * buffer per session (WhatsApp number)
 */
const buffers = new Map();

/**
 * flush delay per user (typing simulation)
 */
const FLUSH_MS = 800;

function scheduleFlush(user) {

  if (buffers.has(user).timer) return;

  const timer = setTimeout(async () => {

    const data = buffers.get(user);
    if (!data) return;

    const text = data.buffer.join("");

    if (text.trim().length > 0) {
      await sendWhatsAppMessage(user, text);
    }

    buffers.delete(user);

  }, FLUSH_MS);

  buffers.get(user).timer = timer;
}

/**
 * STREAM LISTENER (REALTIME REDIS CONSUMER)
 */
function startWhatsAppStreamBridge() {

  const sub = redis.duplicate();
  sub.subscribe(CHANNEL);

  console.log("📡 WhatsApp Stream Bridge ACTIVE");

  sub.on("message", async (_, msg) => {

    const { sessionId, token } = JSON.parse(msg);

    if (!buffers.has(sessionId)) {
      buffers.set(sessionId, { buffer: [], timer: null });
    }

    const entry = buffers.get(sessionId);

    entry.buffer.push(token);

    scheduleFlush(sessionId);
  });
}


// 🟣 REDIS STREAM BUS SUBSCRIPTION

// 🟣 AGENT FANOUT STREAM HANDLER
bus.subscribe(async (event) => {
  if (event.event === "agent:result") {
    console.log("🤖 AGENT:", event.payload.agent, event.payload.output);
  }

  if (event.event === "stream:final") {
    console.log("📡 FINAL STREAM:", event.payload.text);
  }
});
bus.subscribe(async (event) => {

  try {
    if (event.event === "token") {
      // forward token to WhatsApp live stream
      if (this && this.sendMessage) {
        await this.sendMessage(event.payload.user, event.payload.token);
      }
    }

    if (event.event === "typing:on") {
      if (this && this.sendTyping) {
        await this.sendTyping(event.payload.user, true);
      }
    }

    if (event.event === "typing:off") {
      if (this && this.sendTyping) {
        await this.sendTyping(event.payload.user, false);
      }
    }

  } catch (e) {
    console.log("⚠️ Bus event error:", e.message);
  }

});

module.exports = { startWhatsAppStreamBridge };
