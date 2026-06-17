const express = require('express');
const kernel = require('./core/kernel/stable');

const app = express();
const PORT = process.env.PORT || 3000;

kernel.boot();

app.get('/health', (req, res) => {
  res.json(kernel.health());
});

app.get('/', (req, res) => {
  res.json({
    service: "AfriAI",
    status: "running",
    kernel: kernel.health()
  });
});

app.listen(PORT, () => {
  console.log("🚀 RENDER SERVER RUNNING ON", PORT);
});
