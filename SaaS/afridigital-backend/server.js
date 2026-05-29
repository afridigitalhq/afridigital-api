const express = require('express');
const { runAI } = require('./core/runtime/entry');

const app = express();
app.use(express.json());

// HEALTH
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mode: "production-safe-ai-v1"
  });
});

// WHATSAPP ENTRYPOINT (ONLY ONE PATH)
app.post('/webhook', async (req, res) => {
  const payload = req.body;

  const result = await runAI({
    userId: payload.from || "anon",
    text: payload.text || ""
  });

  res.json({
    ok: true,
    reply: result.reply,
    mode: result.mode || "ai"
  });
});

// STREAM SAFE ENDPOINT (OPTIONAL)
app.get('/stream', (req, res) => {

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");

  const text = req.query.text || "";

  const words = ("STREAM: " + text).split(" ");

  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      res.write("data: [DONE]\n\n");
      clearInterval(interval);
      return res.end();
    }

    res.write(`data: ${words[i]}\n\n`);
    i++;
  }, 80);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 CONTROL PLANE v1.5 RUNNING ON", PORT);
});
