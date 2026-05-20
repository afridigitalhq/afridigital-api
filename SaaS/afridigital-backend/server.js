require("./core/pipeline/consumers/logger.consumer");
require("./core/pipeline/consumers/brain.consumer");
require("./core/pipeline/consumers/delivery.consumer");
require("./core/consumers/brain.consumer");
require("./core/consumers/delivery.consumer");
require("./core/consumers/logger.consumer");

require("./core/consumers/logger.consumer");

require("dotenv").config();

const express = require("express");
const bus = require("./core/pipeline/bus/eventBus");
const EVENTS = require("./core/pipeline/events/eventTypes");

const app = express();
app.use(express.json());

console.log('🔍 ENV DEBUG:', {
  META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
  META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID
});

// STATUS HANDLER
const { handleWhatsAppStatus } = require('./core/whatsapp-status-handler');

app.get('/health', (req, res) => {
  return res.json({ ok: true, trace: true });
});

// WEBHOOK
app.post('/webhook', async (req, res) => {
const traceId = "wa_" + Date.now();
console.log("🧾 TRACE START:", traceId);

console.log("🧾 TRACE START:", traceId);

console.log("🧾 WEBHOOK TRACE START:", traceId);

console.log("🧾 TRACE START:", traceId);
  console.log("🔥 WEBHOOK ENTRY HIT AT NODE LEVEL - LIVE CONFIRMED");
  console.log("🔥 WEBHOOK HIT CONFIRMED"); console.log("🚀 CLEAN WEBHOOK HIT:", JSON.stringify(req.body));

  try {
    if (req.body?.entry) {
      handleWhatsAppStatus(req.body.entry);
    }

    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

if (msg?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
  const m = msg.entry[0].changes[0].value.messages[0];
  bus.emit(EVENTS.WHATSAPP_MESSAGE_RECEIVED, {
    from: m.from, traceId,
    text: m.text?.body
  });
}
const eventBus = require("./core/pipeline/eventBus");

if (msg) {
  eventBus.emit(EVENTS.WHATSAPP_MESSAGE_RECEIVED, {
    from: msg.from,
    text: msg.text?.body
  });
}
    console.log("⚠️ MSG PARSE:", msg);

    const from = msg.from;
    const text = msg.text?.body;

    console.log("📩 INCOMING:", from, text);

    const afriEngine = require('./core/runtime/afri-whatsapp-engine');
    const delivery = require('./services/whatsapp-gateway/core/delivery/deliveryEngine');

    const { reply } = await brain.processMessage(
      { body: { message: text, from } },
      res
    );

    console.log("🧠 REPLY:", reply);

    if (reply) {
      await delivery.deliver(from, reply);
    }

    return res.sendStatus(200);

  } catch (e) {
    console.error("WEBHOOK ERROR:", e);
    return res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
// trace ping
