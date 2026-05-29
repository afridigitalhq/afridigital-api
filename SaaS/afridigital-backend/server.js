const express = require('express');

const logger = require('./core/middleware/logger');
const validator = require('./core/middleware/validator');
const errorHandler = require('./core/middleware/errorHandler');

const { runBrain } = require('./core/ai/brain');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(logger);
app.use(validator);

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'afridigital-ai-backend',
    mode: 'safe-brain-v1-sse'
  });
});

/**
 * 🧠 WEBHOOK (NON-STREAM)
 */
app.post('/webhook', async (req, res, next) => {
  try {
    const result = await runBrain(req.body);

    return res.json({
      ok: true,
      result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 🌊 SSE STREAM ENDPOINT
 */
app.get('/stream', async (req, res) => {
  const text = req.query.text || "hello";
  const from = req.query.from || "anonymous";

  // SSE HEADERS
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  console.log("🌊 STREAM OPEN:", from);

  let alive = true;

  // heartbeat (prevents Render timeout)
  const heartbeat = setInterval(() => {
    if (!alive) return;
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 15000);

  try {
    // step 1: send initial event
    res.write(`event: start\ndata: streaming_started\n\n`);

    // step 2: simulate streaming brain response
    const result = await runBrain({ from, text });

    const chunks = result.result?.split(" ") || result.reply.split(" ");

    for (let i = 0; i < chunks.length; i++) {
      if (!alive) break;

      res.write(`event: token\ndata: ${chunks[i]}\n\n`);

      await new Promise(r => setTimeout(r, 200));
    }

    // final event
    res.write(`event: done\ndata: ${JSON.stringify(result)}\n\n`);

    res.end();

  } catch (err) {
    console.error("🔥 STREAM ERROR:", err);

    res.write(`event: error\ndata: ${err.message}\n\n`);
    res.end();
  }

  req.on('close', () => {
    alive = false;
    clearInterval(heartbeat);
    console.log("🌊 STREAM CLOSED:", from);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SAFE AI + SSE STREAM running on", PORT);
});
