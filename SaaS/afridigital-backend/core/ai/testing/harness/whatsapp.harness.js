/**
 * 🧪 A3.18.17 LIVE WHATSAPP TEST HARNESS (FIXED)
 */

const { handleWebhook } = require("../../webhook/webhook.bridge");
const { handleEvent } = require("../../orchestrator/ai.orchestrator");
const { sendMessageToWhatsApp } = require("../../whatsapp/connector/send.bridge");

const logs = [];

function simulateInbound(from, message, bus) {

  const event = handleWebhook({
    from,
    message
  }, bus);

  logs.push({ stage: "INBOUND", event });

  return event;
}

function runPipeline(event) {

  const result = handleEvent(event);

  logs.push({ stage: "ORCHESTRATION", result });

  return result;
}

async function simulateDelivery(task) {

  const res = sendMessageToWhatsApp(task);

  logs.push({ stage: "DELIVERY", response: res });

  return res;
}

async function runTest(bus) {

  const event = simulateInbound("test-user", "hello afriai", bus);

  const aiResult = runPipeline(event);

  const delivery = simulateDelivery({
    payload: {
      to: "test-user",
      body: aiResult?.payload?.reply || "NO_REPLY"
    }
  });

  return { event, aiResult, delivery, logs };
}

module.exports = {
  simulateInbound,
  runPipeline,
  simulateDelivery,
  runTest
};
