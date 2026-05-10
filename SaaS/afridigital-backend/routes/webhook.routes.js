const router = require('express').Router();

router.get('/', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('VERIFY REQUEST:', req.query);

    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('✅ WEBHOOK VERIFIED');
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);

  } catch (err) {
    console.error('❌ VERIFY ERROR:', err);
    return res.sendStatus(500);
  }
});

router.post('/', (req, res) => {
  try {
    console.log('📩 WEBHOOK BODY:', JSON.stringify(req.body, null, 2));

    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      console.log('💬 FROM:', message.from);
      console.log('🧠 TEXT:', message.text?.body || 'NO_TEXT');
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error('🔥 POST ERROR:', err);
    return res.sendStatus(200);
  }
});

module.exports = router;
