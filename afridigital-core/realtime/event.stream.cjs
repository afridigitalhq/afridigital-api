/**
 * 🌊 AFRI LIVE EVENT STREAM (WebSocket)
 */

const { WebSocketServer } = require("ws");
const eventTap = require("../tap/event.tap.cjs");

class EventStream {
  init(server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws) => {
      ws.send(JSON.stringify({
        event: "STREAM_CONNECTED",
        ts: Date.now()
      }));
    });

    // poll tap buffer and broadcast
    setInterval(() => {
      const events = eventTap.getTraces(10);

      const payload = JSON.stringify({
        event: "EVENT_BATCH",
        data: events
      });

      this.wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(payload);
        }
      });

    }, 1000);

    console.log("🌊 EVENT STREAM ACTIVE");
  }
}

module.exports = new EventStream();
