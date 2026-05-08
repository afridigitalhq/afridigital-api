const mesh=require('./modules/mesh');
const realtime=require('./modules/realtime');
const http=require('http');
require('./modules/self-heal');
require('./modules/system-watch');
const opsEngine=require('./modules/ops-v7/engine');
const alerts=require('./modules/alerts');const adminBus=require('./modules/admin-bus');
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// WhatsApp routes FIRST
app.use("/", require("./routes/whatsapp"));

// API test route
app.get("/api/test", (req, res) => {
  res.json({ status: "API working" });
});

// SPA fallback LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;

const interactiveCards = require("./routes/interactiveCards");
app.use("/cards", interactiveCards);
setInterval(()=>{require('./modules/system-intel').snapshot();},3600000);
setInterval(()=>require('./modules/alerts').run?.(),300000);
setInterval(async()=>{try{const supervisor=require('./modules/supervisor');const report=await supervisor.watch();await opsEngine.run(report);}catch(e){console.log('ops-v7 error',e)}},120000);

const server=http.createServer(app);
realtime.boot(server);
mesh.boot();
server.listen(PORT,"0.0.0.0",()=>{
  console.log("🚀 AFRIDIGITAL V10 ENTITY OS ACTIVE ON",PORT);
});
