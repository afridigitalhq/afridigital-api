import { io } from "socket.io-client";
import { eventBus } from "./eventBus";

export const socket = io("https://afridigital-api.onrender.com", {
  transports: ["websocket"]
});

socket.on("system:log", (d) => eventBus.emit("log", d));
socket.on("whatsapp:event", (d) => eventBus.emit("whatsapp", d));
socket.on("ai:trace", (d) => eventBus.emit("trace", d));
