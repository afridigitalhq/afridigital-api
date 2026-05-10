const router = require('express').Router();
const sendWhatsAppMessage = require('../services/whatsapp.send');

router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (
    mode === 'subscribe' &&
    token === (process.env.VERIFY_TOKEN || 'afri_verify_123')
  ) {
    console.log('✅ WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post('/', async (req, res) => {
  try {
    console.log('📩 WEBHOOK:', JSON.stringify(req.body, null, 2));

    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || '';

      console.log('💬 FROM:', from);
      console.log('🧠 TEXT:', text);

      const reply = `🤖 AfriAI says: You said "${text}"`;

      await sendWhatsAppMessage(from, reply);

      console.log('🚀 AI REPLIED SUCCESSFULLY');
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error('🔥 WEBHOOK ERROR:', err);
    return res.sendStatus(200);
  }
});

module.exports = router;
