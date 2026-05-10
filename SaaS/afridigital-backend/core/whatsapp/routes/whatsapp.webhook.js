const express = require('express');
const router = express.Router();

const { processLiveMessage } =
require('../../bridge/engine/live.bridge');

const { sendWhatsAppMessage } =
require('../services/whatsapp.sender');

// VERIFY WEBHOOK
router.get('/webhook/whatsapp', (req, res) => {

  const mode =
    req.query['hub.mode'];

  const token =
    req.query['hub.verify_token'];

  const challenge =
    req.query['hub.challenge'];

  if (
    mode === 'subscribe' &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {

    return res.status(200)
      .send(challenge);
  }

  return res.sendStatus(403);
});

// RECEIVE MESSAGES
router.post('/webhook/whatsapp', async (req, res) => {

  try {

    const entry =
      req.body.entry?.[0];

    const changes =
      entry?.changes?.[0];

    const value =
      changes?.value;

    const message =
      value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const sender =
      message.from;

    const text =
      message.text?.body || '';

    console.log(
      '📩 Incoming:',
      sender,
      text
    );

    const result =
      await processLiveMessage({
        sender,
        message: text
      });

    await sendWhatsAppMessage(
      sender,
      result.reply
    );

    return res.sendStatus(200);

  } catch (err) {

    console.log(
      '❌ Webhook Error',
      err.message
    );

    return res.sendStatus(500);
  }
});

module.exports = router;
