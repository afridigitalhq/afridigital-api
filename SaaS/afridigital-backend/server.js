const express = require('express');

const logger = require('./core/middleware/logger');
const validator = require('./core/middleware/validator');
const errorHandler = require('./core/middleware/errorHandler');

const { traceDispatch } = require('./core/runtime/traceDispatcher');
const { streamDispatch } = require('./core/runtime/streamDispatcher');
const { createStream } = require('./core/stream/emitter');

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(logger);
app.use(validator);

/**
 * HEALTH
 */
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'afridigital-ai-backend',
    mode: 'streaming-v1'
  });
});

/**
 * NORMAL MODE (JSON)
 */
app.post('/webhook', async (req, res, next) => {
  try {
    const result = await traceDispatch(req.body);

    res.json({
      ok: true,
      ...result
    });

  } catch (err) {
    next(err);
  }
});

/**
 * STREAMING MODE (REAL TIME AI)
 */
app.post('/stream', async (req, res, next) => {
  try {

    const stream = createStream(res);

    await streamDispatch(req.body, stream);

  } catch (err) {
    next(err);
  }
});

/**
 * ERROR HANDLER
 */
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 STREAMING AI ENGINE running on", PORT);
});
