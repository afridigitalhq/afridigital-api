const express = require("express");
const app = express();
const { aggregator } = require("../taps/kernel.tap");

app.get("/soc/events", (req, res) => {
  res.json(aggregator.flush());
});

app.get("/soc/health", (req, res) => {
  res.json({ status: "SOC ONLINE", mode: "READ_ONLY" });
});

const PORT = 9099;
app.listen(PORT, () => {
  console.log("🧠 SOC DASHBOARD RUNNING ON PORT", PORT);
});
