/**
 * 🧠 SAFE A3.18.12 ORCHESTRATOR
 * Adds cooldown protection to AI brain
 */

const { handleEvent } = require("./ai.orchestrator");
const { allow } = require("../pipeline/safe.pipeline");

function safeHandle(event) {

  if (!allow(event)) {
    return {
      status: "BLOCKED_COOLDOWN",
      eventId: event.id
    };
  }

  return handleEvent(event);
}

module.exports = { safeHandle };
