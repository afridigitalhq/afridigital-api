require("dotenv").config();

const express = require("express");
const http = require("http");

const { registerWebhook } = require("./services/webhook.service");

console.log("🚀 AfriCore Modular Server Booting...");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json({ status: "OK", system: "AfriCore Modular" });
});

registerWebhook(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
