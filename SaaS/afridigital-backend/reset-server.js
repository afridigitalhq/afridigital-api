const fs = require('fs');

const base = `
const express = require('express');
const app = express();

app.use(express.json());

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', kernel: 'v8-clean' });
});

const { webhook } = require('./core/webhooks/whatsapp.webhook');

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  setImmediate(async () => {
    try {
      await webhook(req.body);
    } catch (err) {
      console.error('WEBHOOK ERROR:', err);
    }
  });
});

const PORT = process.env.PORT || 10000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 V8.8 STABLE KERNEL RUNNING', PORT);
  });
}

module.exports = app;
`;

fs.writeFileSync('server.js', base.trim());
console.log('🧼 SERVER RESET DONE (SAFE MODE)');
