const express = require("express");
const bodyParser = require("body-parser");

const engine = require("./services/whatsapp.engine");

const app = express();
app.use(bodyParser.json());

// start worker FIRST (important)
engine.startWorker();

// webhook routes
require("./routes/webhook.routes")(app, engine);

// health check
app.get("/", (req, res) => {
  res.send("AfriAI ONLINE 🤖");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
