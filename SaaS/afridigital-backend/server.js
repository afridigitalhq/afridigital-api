console.log("🚀 SERVER BOOT FILE ACTIVE");

const express = require("express");
const app = express();

// 🔥 FORCE RAW BODY SUPPORT FOR WEBHOOKS
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// GLOBAL TRACE
app.use((req, res, next) => {
  console.log("🌍 HIT:", req.method, req.url);
  console.log("📦 RAW BODY:", req.body);
  next();
});

// ENGINE
const engine = require("./services/whatsapp.engine");
engine.startWorker();

// ROUTES
const webhookRoutes = require("./routes/webhook.routes");
app.use("/", webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 LISTENING ON PORT", PORT);
});
