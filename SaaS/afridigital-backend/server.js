console.log("🚀 SERVER BOOT STARTED");
const apiGateway = require("./core/gateway/apiGateway");
console.log("🚀 RENDER BOOT");console.log("REDIS_URL:",process.env.REDIS_URL?"LOADED":"MISSING");
const express = require("express");

const { runKernel } = require("./core/kernel/runtime");
const { validateRequest } = require("./core/policy/guard");
const { startWhatsAppStreamBridge } = require("./core/whatsapp/streamBridge");
const { startTypingBridge } = require("./core/whatsapp/typingBridge");
const app = express();
app.use(express.json())
// AUTO-INJECTED ROUTES
app.post('/mesh/gossip',(req,res)=>{
  const mesh=require('./core/mesh/meshNode');
  mesh.receive(req.body);
  res.json({ok:true});
});
;
app.get("/stream", (req,res)=>res.json({ok:true,stream:"not implemented"}));
// 🚀 BOOT OS SUBSYSTEMS
startWhatsAppStreamBridge();
startTypingBridge();
// HEALTH (OS STATUS)
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    mode: "LLM-OS-v1",
    subsystems: [
      "kernel",
      "orchestrator",
      "memory",
      "stream",
      "policy",
      "agents"
    ]
  });
// MAIN OS ENTRYPOINT
app.post("/webhook", async (req, res) => {
const textSafe = (v) => String(v || "");
const safe = (v) => (v || "");
const { normalizeEvent } = require("./core/utils/safeEvent");
  const { from, text } = normalizeEvent(req.body);
  try {
    const { handleStreamRequest } = require("./core/kernel/streamGateway");
    await handleStreamRequest({
      user: from,
      text
    });
    return res.json({ ok: true });
  } catch (e) {
    return res.json({ ok: false, error: e.message || e.toString() });
  }
const PORT = process.env.PORT || 10000;

app.use(/api, apiGateway);
app.listen(PORT, () => {
