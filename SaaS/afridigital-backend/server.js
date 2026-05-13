// v2 disabled until implemented (clean bootstrap state)

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

// GLOBAL CLUSTER MODE CORE (v1)
app.get("/health", (req,res)=>res.json({status:"OK",cluster:"AFRIBANK-CLUSTER-V1"}));

app.post("/events",(req,res)=>{
const clusterV2 = require("./core/cluster/cluster.v2");
  const hub = require("./core/realtime/event.hub");
  const event = req.body;
  if(event) clusterV2.emit(event);
  res.json({ok:true,forwarded:true});
});

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "AfriDigital API"
  });
});

attachSSE(app);

const journalWS = new JournalWSServer(server);

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

app.get('/cluster/replay',(req,res)=>{
  const clusterV2 = require('./core/cluster/cluster.v2');
  const limit = parseInt(req.query.limit || '50');
  res.json(clusterV2.replay(limit));
});
