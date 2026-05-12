const express = require("express");
const app = express();

app.use(express.json());

// ENGINE START
const engine = require("./services/whatsapp.engine");
engine.startWorker();

// ROUTES
const webhookRoutes = require("./routes/webhook.routes");
app.use(webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
