require('./afridigital-core/kernel/fraud/fraud.observer.wire.cjs')();
require('./afridigital-core/kernel/fraud/fraud.pipeline.wire.cjs')();
const fraudControl=require("./afridigital-core/kernel/fraud/fraud.control.cjs");
const eventStream = require("./bootstrap/event.stream.bridge.cjs");
require('./bootstrap/env.load.cjs');
const adminEvents = require('./afridigital-core/kernel/api/admin.events.api.cjs');
const attachWS = require('./bootstrap/ws.attach.cjs');
const eventTracesRoute = require('./routes/events/traces.route');
/**
 * MAIN APPLICATION SERVER
 * (All runtime logic must start here or downstream)
 */

console.log("🚀 AfriDigital Server Booting...");

// Example safe import boundary (now protected by bootstrap)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    system: "AfriDigital Locked Runtime",
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});


// attach websocket stream
const http = require('http');
const server = http.createServer(app);
eventStream.init(server);
if(!global.__AFRI_LISTEN__) { global.__AFRI_LISTEN__ = true; server.listen(); } // LISTEN_GUARD;
module.exports = server;


attachWS(server);


app.get('/payment-graph', (req, res) => {
  const graph = require('./afridigital-core/kernel/visualizers/payment.graph.cjs');
  res.json(graph.getGraph());
});



adminEvents(app);


const httpServer = server;
eventStream.init(httpServer);

console.log('🔐 ADMIN CONFIG:', {
  whatsapp: process.env.ADMIN_WHATSAPP,
  email: process.env.ADMIN_EMAIL
});

console.log('🟢 AFRI BOOT OK - SERVER STARTING');

fraudControl.start();
