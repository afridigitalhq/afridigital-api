const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.get("/env-check", (req, res) => {
  res.json({
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID,
    META_VERIFY_TOKEN: !!process.env.META_VERIFY_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL
  });
});





app.get('/webhook/whatsapp', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (verifyToken !== process.env.META_VERIFY_TOKEN) {
    return res.sendStatus(403);
  }

  return res.status(200).send(challenge);
});


app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const { messagePipeline } = require('./core/pipeline/messagePipeline');
    const { flowEngine } = require('./core/engine/flowEngine');
    const { sendMessage } = require('./adapters/whatsapp/sendMessage');

    const result = messagePipeline(req);
    if (!result || !result.ok) return res.sendStatus(200);

    const reply = await flowEngine(result.message);

    await sendMessage(result.message.from, reply);

    return res.sendStatus(200);
  } catch (err) {
    console.error('WEBHOOK_PIPELINE_ERROR:', err.message);
    return res.sendStatus(200);
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(" CLEAN SERVER RUNNING ON", PORT);
});

