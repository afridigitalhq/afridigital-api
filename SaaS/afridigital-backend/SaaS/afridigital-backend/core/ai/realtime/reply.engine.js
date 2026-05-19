/**
 * ⚡ A3.18.3 AFRAI REALTIME REPLY ENGINE (SAFE MODE)
 * Converts events into AI responses WITHOUT executing actions
 */

const { getHistory } = require("../../event/bus");
const { createEvent } = require("../../event/types");
const { publish } = require("../../event/bus");

function generateReply(event) {

  const text = event?.payload?.text || "";

  // placeholder AI logic (swap with real model later)
  const reply =
    text.includes("hello")
      ? "👋 AfriAI online."
      : `🧠 AfriAI processed: ${text}`;

  const responseEvent = createEvent("AI_REPLY", {
    reply,
    sourceEvent: event.id
  });

  publish(responseEvent);

  return responseEvent;
}

module.exports = { generateReply };
