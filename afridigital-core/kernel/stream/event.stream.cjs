/**
 * 📡 AFRI LIVE EVENT STREAM v1
 * - Datadog-style realtime event bus
 */

const WebSocket = require("ws");

class EventStream {
  init(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = [];

    this.wss.on("connection", (ws) => {
      this.clients.push(ws);
      console.log("🟢 DASHBOARD CONNECTED");

      ws.on("close", () => {
        this.clients = this.clients.filter(c => c !== ws);
      });
    });
  }

  push(event) {
    const data = JSON.stringify(event);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }
}

module.exports = new EventStream();
