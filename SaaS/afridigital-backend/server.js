const express = require('express');
const { runBrain } = require('./core/ai/brain');
const memory = require('./core/memory/store');

const {
  registerClient,
  pushEvent,
  removeClient
} = require('./core/stream/sse');

const app = express();
app.use(express.json({ limit: "2mb" }));

// HEALTH
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: "afridigital-ai",
    mode: "stable-brain-sse"
  });
});

// WEBHOOK (NON-BLOCKING SAFE BRAIN)
app.post('/webhook', async (req, res) => {
  const id = req.body.from || "anon";

  const result = await runBrain(req.body);

  // optional stream push
  pushEvent(id, {
    type: "reply",
    data: result
  });

  res.json({ ok: true, result });
});

// SSE STREAM
app.get('/stream', (req, res) => {
  const id = req.query.from || "anon";

  registerClient(id, res);

  req.on("close", () => {
    removeClient(id);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SAFE AI BRAIN + SSE RUNNING ON", PORT);
});
