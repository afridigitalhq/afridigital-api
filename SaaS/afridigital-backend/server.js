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
    mode: 'safe-brain-v1'
  });
});

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

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 SAFE AI BRAIN v1 running on", PORT);
});
