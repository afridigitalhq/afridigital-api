const express = require("express");
const { publish } = require("../events/event.bus.cjs");

const app = express();
app.use(express.json());

console.log("\n🌐 API GATEWAY ONLINE\n");

app.post("/event", (req, res) => {
  const { type, data } = req.body;

  publish(type, data);

  res.json({ status: "EVENT_DISPATCHED", type });
});

module.exports = app;
