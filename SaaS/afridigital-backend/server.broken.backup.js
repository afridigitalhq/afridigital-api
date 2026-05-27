require("dotenv").config({ override: true });

const express = require("express");
const app = express();
const afriRoutes = require("./africore/kernel/connectivity.kernel");
const afriRoutes = require("./africore/kernel/routes/afri.routes");
app.use(express.json());
app.get("/health", (req,res)=>res.json({ok:true,service:"afrios"}));
app.post("/webhook/whatsapp", (req,res)=>{
  res.json({ok:true,received:true});
});
const PORT = process.env.PORT || 3000;
console.log("🔥 SERVER STARTING ON PORT", PORT);
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 AfriOS stable server running on", PORT);
// AFRIAGENT BOOT HOOK
const { afriagentKernel } = require("./africore/kernel/afriagent/kernel.js");
console.log("🧠 AfriAgent Kernel Ready");
