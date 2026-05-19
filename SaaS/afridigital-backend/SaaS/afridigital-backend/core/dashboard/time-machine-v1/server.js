const StreamBridgeV2 = require('../../runtime/stream.bridge.v2');
const traceBus = require('../../afriai/v10_5/observability/trace.bus.v10.5');
const express = require('express');
const http = require('http');

const app = express();
app.use(express.json());

const server = http.createServer(app);

// SESSION
app.get('/api/start-session', (req, res) => {
  const session = traceBus.startSession();
  res.json({ ok: true, session });
});

// TRACES
app.get('/api/traces', (req, res) => {
  res.json({
    session: traceBus.sessionId,
    traces: traceBus.dump()
  });
});

// HEALTH
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'TIME_MACHINE_RESTORED' });
});

server.listen(3000, () => {
  console.log('🧠 TIME MACHINE BACKEND RESTORED ON 3000');
});

module.exports = server;


// STREAM BRIDGE v2 BOOT
if (typeof server !== 'undefined') {
  }


// STREAM BRIDGE v2 BOOT
if (typeof server !== 'undefined') {
  }


// STREAM BRIDGE v2 BOOT (ORDER SAFE)
setTimeout(() => {
  if (typeof server !== 'undefined') {
    new StreamBridgeV2(server, traceBus);
    console.log('⚡ STREAM BRIDGE v2 ONLINE');
  }
}, 0);
