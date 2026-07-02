const express = require("express");
const EventBus = require("../events/event.bus.cjs");
const { channels, emit } = require("../redis/redis.spine.cjs");

const app = express();
app.use(express.json());

app.post("/job", (req, res) => {
  emit(channels.jobs, req.body);
  res.json({ status: "queued" });
});

app.post("/payment", (req, res) => {
  emit(channels.payments, req.body);
  res.json({ status: "processing" });
});

app.post("/whatsapp", (req, res) => {
  emit(channels.whatsapp, req.body);
  EventBus.publish("WHATSAPP_MESSAGE", req.body);
  res.json({ status: "received" });
});

app.listen(4000, () => {
  console.log("🚀 V18 API GATEWAY RUNNING ON :4000");
});
