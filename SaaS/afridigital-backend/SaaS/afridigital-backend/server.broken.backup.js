const hub = require("./core/realtime/event.hub");
const { attachSSE } = require("./core/gateway/realtime.sse");
const JournalWSServer = require("./core/gateway/journal.ws.gateway");
const RealtimeBridge = require("./core/gateway/realtime.bridge");
const heartbeat = require('./core/cluster/health/heartbeat.monitor');
setInterval(() => heartbeat.check(), 5000);
const PartitionRouter = require('./core/cluster/partition.router');
const ClusterManager = require('./core/cluster/cluster.manager');
const http = require('http');
const RealtimeGateway = require('./core/realtime/ws.gateway');
const express = require("express");

console.log("🔥 SERVER ENTRY ACTIVE");
const app = express();
const journalWS = new JournalWSServer();
const realtimeBridge = new RealtimeBridge(journalWS.io);
const PORT = process.env.PORT || 10000;
process.on("uncaughtException", e => {
  console.log("💥 UNCAUGHT EXCEPTION:", e);
});
process.on("unhandledRejection", e => {
  console.log("💥 UNHANDLED REJECTION:", e);
app.use(express.json());
app.use('/api/replay', require('./routes/replay/replay.routes'));
console.log("🧩 MOUNTING WEBHOOK ROUTE");
app.use("/webhook", require("./routes/webhook.routes"));
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "AfriDigital API"
  });
app.listen(PORT, () => {
attachSSE(app);
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
// --- REALTIME LAYER INIT ---
const server = http.createServer(app);
const realtime = new RealtimeGateway(server);
// expose globally for event bus
global.realtime = realtime;
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 AfriOS API + Realtime running on", PORT);
