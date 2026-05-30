
const express = require('express');
const router = express.Router();

// AI CORE
router.post('/ai', async (req,res)=>{
  const kernel = require('../africore/runtime/kernel');
  const result = await kernel.run(req.body);
  res.json(result);
});

// WHATSAPP
router.post('/whatsapp/send', (req,res)=>{
  res.json({ ok:true, module:'whatsapp', status:'v1' });
});

// EVENT SYSTEM
router.post('/event', (req,res)=>{
  res.json({ ok:true, received:true });
});

module.exports = router;
