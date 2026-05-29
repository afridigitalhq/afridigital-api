const express = require('express');
const { runBrain } = require('./core/ai/brain');

const {
  registerClient,
  removeClient
} = require('./core/stream/sse');

const app = express();
app.use(express.json({ limit: "2mb" }));

// HEALTH
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mode: "stream-pipeline-v2"
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

// WEBHOOK (BOUND TO STREAM)
app.post('/webhook', async (req, res) => {
  const traceId = req.body.from || "anon";

  runBrain(req.body, traceId); // async fire, stream handles output

  res.json({
    ok: true,
    traceId,
    mode: "stream-bound-v2"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 STREAM PIPELINE V2 RUNNING ON", PORT);
});
