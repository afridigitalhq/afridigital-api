const router = require('express').Router();
const AfriOS = require('../core/afrios.orchestrator');
const sendWhatsAppMessage = require('../services/whatsapp.send');

router.post('/', async (req, res) => {
  try {

    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || '';

    const result = await AfriOS(text, from);

    // 💬 AI OR CARD RESPONSE
    await sendWhatsAppMessage(from, result.reply);

    console.log("🚀 AFRIOS RESPONSE TYPE:", result.type);

    return res.sendStatus(200);

  } catch (err) {
    console.error("🔥 AFRIOS ERROR:", err);
    return res.sendStatus(200);
  }
});

module.exports = router;
