const express = require('express');

const logger = require('./core/middleware/logger');
const validator = require('./core/middleware/validator');
const errorHandler = require('./core/middleware/errorHandler');

const { runBrain } = require('./core/ai/brain');

const app = express();

// PIPELINE
app.use(express.json({ limit: '2mb' }));
app.use(logger);
app.use(validator);

// HEALTH
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'afridigital-ai-backend',
    mode: 'ai-brain-v1'
  });
});

// WEBHOOK → AI BRAIN EXECUTION
app.post('/webhook', async (req, res, next) => {
  try {
    const payload = req.body;

    console.log(`📩 [${req.traceId}] incoming:`, payload);

    const result = runBrain(payload);

    const response = {
      to: payload.from || 'unknown',
      intent: result.intent,
      text: result.reply,
      traceId: req.traceId
    };

    console.log(`🧠 [${req.traceId}] AI RESPONSE:`, response);

    res.json({
      ok: true,
      result: response
    });

  } catch (err) {
    next(err);
  }
});

// ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI BRAIN BACKEND running on ${PORT}`);
});
