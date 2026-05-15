/**
 * 🚀 A3.18.18 RUNTIME BOOTSTRAP
 * Wires AI system into live event loop
 */

const { bus } = require("../bus/event.bus");

// Core AI modules
const { handleWebhook } = require("../../ai/webhook/webhook.bridge");
const { safeHandle } = require("../../ai/orchestrator/safe.orchestrator");

/**
 * Attach webhook entry
 */
function attachWebhook() {

  return (payload) => {
    const event = handleWebhook(payload, bus);
    bus.publish(event);
    return event;
  };
}

/**
 * Attach AI runtime processing
 */
function attachAIRuntime() {

  bus.subscribe("WHATSAPP_INBOUND", (event) => {
    safeHandle(event);
  });
}

/**
 * Attach AI reply loop
 */
function attachAIReplies() {

  bus.subscribe("AI_REPLY", (event) => {
    // re-inject into orchestrator (delivery pipeline)
    safeHandle(event);
  });
}

/**
 * BOOT SYSTEM
 */
function DISABLED_DISABLED {

  attachAIRuntime();
  attachAIReplies();

  console.log("⚡ A3.18.18 EVENT RUNTIME ONLINE");
  console.log("🧠 AfriAI LIVE PIPELINE ACTIVE");
}

module.exports = {
  bus,
  startRuntime,
  attachWebhook
};
