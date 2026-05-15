/**
 * 🌐 A3.18.3 AI STREAM PIPELINE
 * Feeds AI replies into websocket stream
 */

const { generateReply } = require("../realtime/reply.engine");

function attachAIStream(bus) {

  bus.subscribe("LEGACY_EVENT_BLOCKED", (event) => {

    if (event.type === "INGEST") {
      generateReply(event);
    }

  };
}

module.exports = { attachAIStream };
