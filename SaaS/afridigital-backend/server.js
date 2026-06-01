
const config = require('./core/kernel/config/loader');
global.config = config;

require('./core/kernel/hotReloadWatcher');
require('module-alias/register');
require('./core/kernel/config/loader');
const express = require('express');
const app = express();

app.use(express.json());

// ================= ENV CHECK =================
console.log("🧠 BOOT CHECK:");
console.log("REDIS:", process.env.REDIS_URL ? "SET" : "MISSING");

// ================= HEALTH =================
app.get('/health', (req,res)=>{
  res.json({
    ok:true,
    service:'afri-ai-v6-locked',
    mode:'PRODUCTION_LOCKED'
  });
});

// ================= A2 CORE =================
const a2Engine = require('./core/ai/gateway/v5/plugins/whatsapp/a2Engine.ext');

// ================= WEBHOOK =================
app.post('/webhook/whatsapp', async (req,res)=>{
  try {
    const result = await a2Engine.enqueue({
      text: req.body?.text || '',
      to: req.body?.from || 'mock'
    });

    res.json({
      ok:true,
      engine:'A2-LOCKED',
      queued:true,
      id: result.id
    });

  } catch (e) {
    res.status(500).json({
      ok:false,
      error:e.message
    });
  }
});

// ================= WORKER =================
const worker = require('./core/workers/a2Worker');
worker.start();

// ================= QUEUE DRRAINER =================
const drainer = require('./core/ai/gateway/v5/runtime/a2QueueDrainer');
if (drainer && drainer.start) drainer.start();

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0',()=>{
  console.log("🚀 A2 PRODUCTION LOCKED SYSTEM RUNNING ON",PORT);
});


app.get('/debug/env', (req, res) => {
  res.json({
    instance: process.env.RENDER_SERVICE_NAME || 'unknown',
    redis: !!process.env.REDIS_URL,
    meta: {
      token: process.env.META_ACCESS_TOKEN ? 'SET' : 'MISSING',
      phone: process.env.META_PHONE_NUMBER_ID ? 'SET' : 'MISSING'
    },
    all_meta_keys: Object.keys(process.env).filter(k =>
      k.includes('META') || k.includes('REDIS')
    )
  });
});

module.exports = app;


