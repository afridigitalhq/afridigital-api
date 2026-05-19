require("dotenv").config();

const express = require("express");
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
  console.log("🚀 CLEAN WEBHOOK HIT:", JSON.stringify(req.body));

  try {
    if (req.body?.entry) {
      handleWhatsAppStatus(req.body.entry);
    }

    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

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
