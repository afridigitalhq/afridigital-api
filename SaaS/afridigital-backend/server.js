const express = require("express");
const app = express();

app.use(express.json());

// ROUTES + ENGINE SAFE LOAD
const engine = require("./services/whatsapp.engine");
require("./routes/webhook.routes")(app, engine);

try {
  engine.startWorker();
  console.log("🚀 WhatsApp Engine Started");
} catch (err) {
  console.log("ENGINE BOOT ERROR:", err.message);
}

// PORT BINDING (CRITICAL FOR RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
