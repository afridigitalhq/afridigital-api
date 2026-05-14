const startAfriBankV2 = require('./core/bootstrap/v2.bootstrap');
startAfriBankV2();
const express = require("express");
const http = require("http");
const cors = require("cors");

const hub = require("./core/realtime/event.hub");
const { attachSSE } = require("./core/gateway/realtime.sse");
const JournalWSServer = require("./core/gateway/journal.ws.gateway");
const RealtimeBridge = require("./core/gateway/realtime.bridge");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "AfriDigital API"
  });
});

attachSSE(app);

const journalWS = new JournalWSServer();
journalWS.attachServer(server);

const realtimeBridge = new RealtimeBridge(journalWS.io);

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log("🚀 AfriDigital API LIVE:", PORT);

  setInterval(() => {
    hub.emitEvent({
      type: "system.heartbeat",
      ts: Date.now(),
      payload: {
        cluster: "AFRIBANK-CORE"
      }
    });
  }, 5000);
});
