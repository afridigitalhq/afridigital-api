const express = require('express');
const { runBrain } = require('./core/ai/brain');

const {
  registerClient,
  removeClient
} = require('./core/stream/sse');

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mode: "stream-tokens-v1"
  });
});

// WEBHOOK (returns immediately, streams async)
app.post('/webhook', async (req, res) => {
  const id = req.body.from || "anon";

  const result = await runBrain(req.body);

  res.json({
    ok: true,
    result
  });
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
  console.log("🚀 STREAM TOKENS ENGINE RUNNING ON", PORT);
});
