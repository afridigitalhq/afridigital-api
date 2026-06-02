const express = require('express');

function createApp() {
  const app = express();

  app.use(express.json());

  // CORE CONTRACT ROUTES
  app.get('/health', (req,res)=> {
    res.json({ ok:true, service:'afridigital-api' });
  });

  app.get('/ready', (req,res)=> {
    res.json({ ok:true, status:'ready' });
  });

  app.get('/metrics', (req,res)=> {
    res.json({
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });

  return app;
}

module.exports = createApp;
