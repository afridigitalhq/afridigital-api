console.log("🔥 WHATSAPP DEPLOY HASH:", process.env.RENDER_GIT_COMMIT || "local");
console.log("🔥 ENTRY SERVER LOADED:", __filename);
console.log("🔥 SERVER VERSION: WHATSAPP FIX ACTIVE");
const express = require("express");
const whatsappGateway = require("./services/whatsapp-gateway");

const app = express();
app.use(express.json());
console.log("🧭 WHATSAPP ROUTE REGISTERED OK")
console.log("🧭 WHATSAPP ROUTE ACTIVE");
console.log("🧭 WHATSAPP ROUTER MOUNTED");

// mount gateway
app.use("/whatsapp", whatsappGateway);
console.log("🧭 WHATSAPP ROUTE REGISTERED OK")
console.log("🧭 WHATSAPP ROUTE ACTIVE");
console.log("🧭 WHATSAPP ROUTER MOUNTED");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 AFRIAI RUNNING ON RENDER PORT", PORT);
});
