const express = require('express');
const router = express.Router();

const { handleWhatsAppMessage } =
require('../core/runtime/whatsapp/engine/whatsapp.engine');

// VERIFY WEBHOOK (Meta)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('🟢 WhatsApp Webhook Verified');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// RECEIVE MESSAGES
router.post('/webhook', async (req, res) => {
  try {

    console.log('📩 RAW WEBHOOK:', JSON.stringify(req.body));

    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const message = value?.messages?.[0];

    if (message) {

      await handleWhatsAppMessage({
        from: message.from,
        message: message.text?.body || ''
      });

    }

    res.sendStatus(200);

  } catch (err) {
    console.error('❌ WEBHOOK ERROR:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
