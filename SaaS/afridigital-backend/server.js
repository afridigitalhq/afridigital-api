const express = require('express');

const { runAgent } = require('./core/agents/router');
const { streamLLM } = require('./core/llm/fakeLLM');
const { sseHeaders, sendToken, endStream } = require('./core/stream/sse');

const app = express();
app.use(express.json());

// HEALTH
app.get('/health', (req, res) => {
  res.json({ ok: true, mode: "stream-v2-toolchain" });
});

// NORMAL WEBHOOK (NON STREAM)
app.post('/webhook', async (req, res) => {
  const result = await runAgent(req.body.text || "");
  res.json({ ok: true, result });
});

// STREAMING ENDPOINT (SSE)
app.get('/stream', async (req, res) => {

  sseHeaders(res);

  const text = req.query.text || "";

  const agent = await runAgent(text);

  await streamLLM(text, (token) => {
    sendToken(res, token);
  });

  endStream(res, agent);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 STREAM PIPELINE V2 RUNNING ON", PORT);
});
