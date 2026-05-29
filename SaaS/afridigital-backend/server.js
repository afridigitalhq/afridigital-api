const express = require('express');

const logger = require('./core/middleware/logger');
const validator = require('./core/middleware/validator');
const errorHandler = require('./core/middleware/errorHandler');

const app = express();

// CORE PIPELINE
app.use(express.json({ limit: '2mb' }));
app.use(logger);
app.use(validator);

// HEALTH (KEEP SIMPLE)
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'afridigital-backend',
    status: 'stable'
  });
});

// WEBHOOK (SAFE AI-READY LAYER)
app.post('/webhook', async (req, res, next) => {
  try {
    const payload = req.body;

    console.log(`📩 [${req.traceId}] incoming:`, payload);

    // AI-READY EXECUTION LAYER (safe placeholder)
    const reply = {
      to: payload.from || 'unknown',
      text: `Echo: ${payload.text || ''}`,
      traceId: req.traceId
    };

    console.log(`📤 [${req.traceId}] reply:`, reply);

    res.json({
      ok: true,
      result: reply
    });

  } catch (err) {
    next(err);
  }
});

// ERROR PIPELINE (LAST LAYER)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Hardened backend running on ${PORT}`);
});
