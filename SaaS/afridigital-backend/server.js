const express = require('express');

const app = express();
app.use(express.json());

// HEALTH
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'afridigital-backend' });
});

// WEBHOOK (ALL LOGIC HERE)
app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;

    console.log("📩 INCOMING:", payload);

    // simple inline processing (no external worker)
    const reply = {
      to: payload.from,
      text: `Echo: ${payload.text || ''}`
    };

    console.log("📤 RESPONSE:", reply);

    res.json({ ok: true, reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 BACKEND running on", PORT);
});
