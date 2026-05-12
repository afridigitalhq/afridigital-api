const express = require("express");
const app = express();

app.use(express.json());

// DEBUG GLOBAL REQUEST TRACE
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// SAFE ENGINE LOAD
try {
  const engine = require("./services/whatsapp.engine");
  engine.startWorker();
  console.log("🚀 ENGINE STARTED");
} catch (e) {
  console.log("💥 ENGINE ERROR:", e);
}

// ROUTES
const webhookRoutes = require("./routes/webhook.routes");

// 🔥 FORCE CLEAN MOUNT (IMPORTANT FIX)
app.use(webhookRoutes);

// HEALTH CHECK (fixes Cannot GET /)
app.get("/", (req, res) => {
  res.json({ status: "OK", service: "AfriDigital API alive" });
});

// DEBUG ROUTE TEST
app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
