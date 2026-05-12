console.log("🚀 SERVER BOOT FILE ACTIVE");

const express = require("express");
const app = express();

app.use(express.json());

// GLOBAL TRACE (PROVES REQUEST REACHES THIS FILE)
app.use((req, res, next) => {
  console.log("🌍 HIT:", req.method, req.url);
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
