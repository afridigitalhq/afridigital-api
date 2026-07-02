import mountSOC from "../../bootstrap/soc.mount.js";
const express = require("express");
const http = require("http");

const webhookHandler = require("../gateway/webhook.gateway");

function start() {
  const app = express();
mountSOC(app);
  app.use(express.json());

  app.get("/", (_, res) => {
    res.json({ status: "AfriCore Modular Active" });
  });

  app.post("/webhook", webhookHandler);

  const server = http.createServer(app);

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log("🚀 AfriCore Modular Server Running on", PORT);
  });

  return server;
}

module.exports = start;
