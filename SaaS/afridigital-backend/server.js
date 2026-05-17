console.log("🔥 SERVER VERSION: WHATSAPP FIX ACTIVE");
const express = require("express");
const whatsappGateway = require("./services/whatsapp-gateway/server");

const app = express();
app.use(express.json());

// mount gateway
app.use("/whatsapp", whatsappGateway);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 AFRIAI RUNNING ON RENDER PORT", PORT);
});
