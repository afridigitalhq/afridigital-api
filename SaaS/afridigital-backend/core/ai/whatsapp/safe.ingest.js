const { bus } = require("../../realti../../runtime/eventbus");

function ingest(message) {
  bus.emit("event", {
    type: "whatsapp",
    message
  });
}

module.exports = { ingest };
