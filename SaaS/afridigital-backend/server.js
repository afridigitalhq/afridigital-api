const express = require('express');
const { runOrchestrator } = require('./core/runtime/orchestrator');
const { sseHeaders, send, done } = require('./core/stream/sse');

const app = express();
app.use(express.json());

// HEALTH
app.get('/health', (req, res) => {
  res.json({ ok: true, mode: "llm-orchestrator-v1" });
});

// WEBHOOK (NON-STREAM)
app.post('/webhook', async (req, res) => {

  const result = await runOrchestrator({
    userId: req.body.from || "anon",
    text: req.body.text
  });

  res.json({ ok: true, result });
});

// STREAMING (REAL LLM PIPELINE)
app.get('/stream', async (req, res) => {

  sseHeaders(res);

  const userId = req.query.from || "anon";
  const text = req.query.text || "";

  const result = await runOrchestrator({ userId, text });

  const words = (result.reply || "").split(" ");

  for (const w of words) {
    send(res, w + " ");
    await new Promise(r => setTimeout(r, 60));
  }

  done(res, result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 LLM ORCHESTRATION ENGINE RUNNING ON", PORT);
});
