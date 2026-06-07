const express = require("express");
const app = express();

app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ENV CHECK
app.get("/env-check", (req, res) => {
  res.json({
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID,
    META_VERIFY_TOKEN: !!process.env.META_VERIFY_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL
  });
});

// WEBHOOK (CLEAN)
app.post("/webhook/whatsapp", (req, res) => {
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    const msg = value?.messages?.[0] || null;

    console.log("📩 RAW WEBHOOK:", JSON.stringify(req.body));

    if (msg) {
      console.log("🧠 PARSED MESSAGE:", {
        id: msg.id,
        from: msg.from,
        text: msg.text?.body || null
      });
    } else {
      console.log("⚠️ NO MESSAGE FOUND");
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    return res.sendStatus(200);
  }
});

// START
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 CLEAN SERVER RUNNING ON", PORT);
});


// META VERIFICATION (REQUIRED)
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// WHATSAPP MESSAGE RECEIVER
app.post('/webhook/whatsapp', (req, res) => {
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];

    console.log('📩 WEBHOOK EVENT:', JSON.stringify(req.body));

    if (msg) {
      console.log('🧠 MESSAGE:', {
        from: msg.from,
        text: msg.text?.body
      });
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error('WEBHOOK ERROR:', e.message);
    return res.sendStatus(200);
  }
});
