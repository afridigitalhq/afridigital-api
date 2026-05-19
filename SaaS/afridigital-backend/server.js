console.log('🔍 ENV DEBUG:', { META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN, META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID });
require("dotenv").config();
const express = require("express");
const app = express(); app.use(express.json());


const whatsappGateway = require('./services/whatsapp-gateway/server');

app.use(express.json());

app.get('/health', (req, res) => {
  return res.json({ ok: true, trace: true });
});

app.use('/whatsapp', whatsappGateway);

const PORT = process.env.PORT || 3000;




app.post('/webhook', async (req, res) => {
  console.log("🚀 CLEAN WEBHOOK HIT:", JSON.stringify(req.body));

  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text?.body;

    console.log("📩 INCOMING:", from, text);

    const brain = require('./core/brain');
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

