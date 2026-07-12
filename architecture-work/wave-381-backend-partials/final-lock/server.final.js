import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";

import { mountPublic } from "./bootstrap/public.boot.js";
import { mountRuntime } from "./bootstrap/runtime.boot.js";
import { mountWebsocket } from "./bootstrap/websocket.boot.js";

const app = express();

mountPublic(app);

const server = http.createServer(app);

mountWebsocket(server);

mountRuntime(app);

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log("🚀 AfriDigital API running on port", PORT);
});
