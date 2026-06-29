const { wss } = require("./soc.websocket");

function attachSOCStream(server) {
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/soc-stream") {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
      });
    }
  });
}

module.exports = { attachSOCStream };
