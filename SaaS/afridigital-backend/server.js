const express = require('express');
require('./services/ai-worker'); // start worker

const { ingestMessage } = require('./services/whatsapp');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'api-cluster' });
});

// webhook entry point
app.post('/webhook', (req, res) => {
  ingestMessage(req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 API CLUSTER running on", PORT);
});
