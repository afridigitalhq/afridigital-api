const fs = require('fs');

console.log("🧠 APPLYING UNIFIED OS ROUTER v1 (CLEAN)");

// ==============================
// 1. CLEAN SERVER.JS ROUTING
// ==============================
let server = fs.readFileSync('server.js', 'utf8');

// remove ANY previous gateway injections safely
server = server.replace(
  /app\.use\(['"]\/api['"][\s\S]*?\);\s*/g,
  ''
);

server = server.replace(
  /app\.use\(['"]\/stream['"][\s\S]*?\);\s*/g,
  ''
);

// ==============================
// 2. ADD UNIFIED GATEWAY
// ==============================
const injection = `

// ===== UNIFIED OS ROUTER v1 =====
const apiGateway = require('./core/gateway/apiGateway');
const streamGateway = require('./core/gateway/streamGateway');

app.use('/api', apiGateway);
app.use('/stream', streamGateway);

`;

if (!server.includes("UNIFIED OS ROUTER v1")) {
  server += injection;
}

fs.writeFileSync('server.js', server);

// ==============================
// 3. CREATE GATEWAYS FRESH
// ==============================
fs.mkdirSync('./core/gateway', { recursive: true });

fs.writeFileSync('./core/gateway/apiGateway.js', `
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
`);

fs.writeFileSync('./core/gateway/streamGateway.js', `
const express = require('express');
const router = express.Router();

router.post('/connect', (req,res)=>{
  res.json({ ok:true, stream:'connected', mode:'v1' });
});

module.exports = router;
`);

console.log("🚀 UNIFIED OS ROUTER v1 APPLIED SUCCESSFULLY");
