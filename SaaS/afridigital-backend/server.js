const express = require("express");
const bodyParser = require("body-parser");

const engine = require("./services/whatsapp.engine");

const app = express();
app.use(bodyParser.json());

// start worker FIRST (important)
engine.startWorker();

// webhook routes

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});

// ROUTES
const webhookRoutes = require("./routes/webhook.routes");
app.use(webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
