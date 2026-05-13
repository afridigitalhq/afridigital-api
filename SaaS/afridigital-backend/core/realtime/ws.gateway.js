const WebSocket = require("ws");

class RealtimeGateway {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);

      ws.on("close", () => {
        this.clients.delete(ws);
      });
    });
  }

  broadcast(event) {
    const data = JSON.stringify(event);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }
}

module.exports = RealtimeGateway;
