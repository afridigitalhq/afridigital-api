const WebSocket = require("ws");
const stream = require("../journal/event.stream");

class JournalWSServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (socket) => {
      socket.send(JSON.stringify({
        type: "system",
        message: "AfriOS Journal Gateway Connected"
      }));

      const unsubscribe = stream.subscribe((event) => {
        try {
          socket.send(JSON.stringify({
            type: "event",
            data: event
          }));
        } catch (e) {}
      });

      socket.on("close", () => unsubscribe());
    });
  }
}

module.exports = JournalWSServer;
