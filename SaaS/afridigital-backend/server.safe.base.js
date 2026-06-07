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



app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);
    console.log('📩 WEBHOOK RECEIVED:', msg.id);
    return res.sendStatus(200);
  } catch (e) {
    console.error('WEBHOOK ERROR:', e.message);
    return res.sendStatus(200);
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(" CLEAN SERVER RUNNING ON", PORT);
});

