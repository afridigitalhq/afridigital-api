/**
 * 🌊 AFRI REALTIME EVENT STREAM v1
 * - Pushes EventTap data to WebSocket clients
 */

const WebSocket = require("ws");

class EventStream {
  constructor() {
    this.clients = new Set();
    this.wss = null;
  }

  init(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log("🔌 WS CLIENT CONNECTED");

      ws.on("close", () => {
        this.clients.delete(ws);
      });
    });

    console.log("🌊 EVENT STREAM ACTIVE");
  }

  broadcast(packet) {
    const data = JSON.stringify(packet);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }
}

module.exports = new EventStream();
