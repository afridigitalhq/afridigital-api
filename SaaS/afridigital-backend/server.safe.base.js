const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

function normalizePhone(num) {
  return (num || "").replace(/\+/g, "").replace(/\s/g, "");
}

app.get('/webhook/whatsapp', (req, res) => {
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (verifyToken !== "afri_verify_123") {
    return res.sendStatus(403);
  }

  return res.status(200).send(challenge);
});

app.post('/webhook/whatsapp', async (req, res) => {
console.log('🔥 RAW BODY:', JSON.stringify(req.body))
  try {
    const { messagePipeline } = require('./core/pipeline/messagePipeline');
    const { flowEngine } = require('./core/engine/flowEngine');
    const { sendMessage } = require('./adapters/whatsapp/sendMessage');

    const result = messagePipeline(req);
    console.log("📩 PIPELINE INPUT:", result);

    if (!result || !result.ok) return res.sendStatus(200);

    const reply = await flowEngine(result.message);
    console.log("🧠 AI REPLY:", reply);

    const to = normalizePhone(normalizePhone(result.message.from));

    console.log("📤 SENDING:", to, reply);
    await sendMessage(to, reply);
    console.log("✅ SENT DONE");

    return res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK_PIPELINE_ERROR:", err.message);
    return res.sendStatus(200);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("CLEAN SERVER RUNNING ON", PORT);
});
function normalizePhone(num){return String(num).replace(/[^0-9]/g,'');}
