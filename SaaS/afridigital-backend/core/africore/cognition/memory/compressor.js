const crypto = require("crypto");

/**
 * Converts raw conversation/events into semantic state
 */
function compress(events = []) {
  const summary = {
    topics: [],
    intents: new Set(),
    entities: new Set()
  };

  for (const e of events) {
    if (e.payload?.text) {
      if (e.payload.text.includes("whatsapp")) summary.topics.push("whatsapp");
      if (e.payload.text.includes("deploy")) summary.topics.push("devops");
    }

    if (e.payload?.type) summary.intents.add(e.payload.type);
  }

  return {
    id: crypto.randomUUID(),
    summary: {
      topics: [...new Set(summary.topics)],
      intents: [...summary.intents],
      size: events.length
    }
  };
}

module.exports = { compress };
