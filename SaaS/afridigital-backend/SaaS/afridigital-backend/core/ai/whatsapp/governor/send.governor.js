/**
 * ⚖ A3.18.6 WHATSAPP SEND GOVERNOR
 * Hybrid control system (SAFE + SCALE)
 */

const { publish } = require("../../../event/bus");
const { createEvent } = require("../../../event/types");

/**
 * Decide execution tier
 */
function classifyMessage(message) {

  const text = message.message?.toLowerCase() || "";

  // HIGH RISK (admin approval required)
  if (
    text.includes("bank") ||
    text.includes("payment") ||
    text.includes("otp") ||
    text.includes("verify")
  ) {
    return "REVIEW";
  }

  // CONTROLLED AUTO (rate-limited system messages)
  if (
    text.includes("reminder") ||
    text.includes("daily checkin") ||
    text.includes("update")
  ) {
    return "AUTO_CONTROLLED";
  }

  // SAFE MESSAGES (chat / AI replies)
  return "AUTO";
}

/**
 * MAIN ENTRY POINT
 */
function processOutbound(message) {

  const tier = classifyMessage(message);

  const event = createEvent("WHATSAPP_SEND_INTENT", {
    ...message,
    tier
  });

  publish(event);

  return event;
}

module.exports = { classifyMessage, processOutbound };
