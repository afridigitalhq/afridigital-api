const express = require("express");
const app = express();

// CRASH GUARDS
process.on("uncaughtException", (err) => console.log("💥 CRASH:", err));
process.on("unhandledRejection", (err) => console.log("💥 PROMISE ERROR:", err));

app.use(express.json());

// LOG ALL REQUESTS
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// ROUTES
const webhookRoutes = require("./routes/webhook.routes");
app.use("/", webhookRoutes);

// ENGINE (SAFE WRAP)
try {
  const engine = require("./services/whatsapp.engine");
  engine.startWorker();
  console.log("🚀 ENGINE STARTED");
} catch (e) {
  console.log("💥 ENGINE FAILED SAFE MODE:", e);
}

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
