const app = null;
const engine = require("./services/whatsapp.engine");

// prevent double-start crash
if (!global.__AFRI_ENGINE_STARTED__) {
  global.__AFRI_ENGINE_STARTED__ = true;
  engine.startWorker();
  console.log("🚀 WhatsApp Engine Started");
} else {
  console.log("⚠️ Engine already running (skipped duplicate start)");
}

require("./routes/webhook.routes")(app, engine);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
