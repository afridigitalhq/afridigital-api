const express = require("express");
const app = express();

// BODY PARSER (CRITICAL)
app.use(express.json());

// GLOBAL LOGGER
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "afridigital-api" });
});

// ENGINE (safe boot)
const engine = require("./services/whatsapp.engine");
try {
  engine.startWorker();
} catch (e) {
  console.log("💥 ENGINE CRASH:", e);
}

// ROUTES (IMPORTANT FIX)
const webhookRoutes = require("./routes/webhook.routes");
app.use("/", webhookRoutes);

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
