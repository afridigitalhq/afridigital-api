const { bus } = require("../../realtime/afriscan.graph.ws");

function ingest(message) {
  bus.emit("event", {
    type: "whatsapp",
    message
  });
}

module.exports = { ingest };
