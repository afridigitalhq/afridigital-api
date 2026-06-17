const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: "afridigital-api" });
});

app.post('/webhook', (req, res) => {
  res.json({ ok: true, received: true });
});

module.exports = app;
