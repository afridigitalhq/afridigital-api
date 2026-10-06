import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";

import { mountPublic } from "./bootstrap/public.boot.js";
import { mountRuntime } from "./bootstrap/runtime.boot.js";
import { mountWebsocket } from "./bootstrap/websocket.boot.js";
import { initAfriDigitalBootstrap } from "./src/bootstrap/AfriDigitalBootstrap.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://afridigital-hub.onrender.com"
  ],
  credentials: true
}));

mountPublic(app);

const server = http.createServer(app);

const realtimeGateway = mountWebsocket(server);

mountRuntime(app);

const PORT = process.env.PORT || 10000;

async function startServer() {
  await initAfriDigitalBootstrap(server, realtimeGateway);

  server.listen(PORT, () => {
    console.log("🚀 AfriDigital API running on port", PORT);
  });
}

startServer().catch(error => {
  console.error("❌ AfriDigital startup failed:", error?.message || error);
  process.exit(1);
});
