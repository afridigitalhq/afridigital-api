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
    mode: 'stable-safe-v1'
  });
});

app.post('/webhook', async (req, res, next) => {
  try {
    const payload = req.body || {};

    console.log(`📩 incoming:`, payload);

    const result = await runBrain(payload);

    res.json({
      ok: true,
      result: {
        to: payload.from || "unknown",
        text: result?.reply || "no-response",
        graph: result?.graph || null
      }
    });

  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err);
    res.status(200).json({
      ok: false,
      error: "internal_error",
      trace: err.message
    });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SAFE BACKEND running on ${PORT}`);
});
