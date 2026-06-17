const { sendMessage } = require("../../integrations/whatsapp/cloud.client");
const { emit } = require("../unified/event.bus");

async function handleWhatsApp(message) {
  // emit to graph
  emit({
    type: "whatsapp_inbound",
    payload: message
  });

  // SAFE AUTO REPLY (NO OPENAI)
  let reply = "Message received.";

  if (message.text?.includes("status")) {
    reply = "🟢 System operational (AFRISCAN live)";
  }

  if (message.text?.includes("hello")) {
    reply = "👋 Hello from AfriAI safe mode";
  }

  // send reply
  await sendMessage(message.from, reply);

  emit({
    type: "whatsapp_outbound",
    payload: {
      to: message.from,
      text: reply
    }
  });

  return reply;
}

module.exports = { handleWhatsApp };
