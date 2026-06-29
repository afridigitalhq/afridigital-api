const WebSocket = require("ws");
const { SOCAggregator } = require("../aggregator/soc.aggregator");

const soc = new SOCAggregator();
const wss = new WebSocket.Server({ noServer: true });

function ingest(event) {
  soc.ingest(event);
  broadcast();
}

function snapshot() {
  return soc.snapshot();
}

function broadcast() {
  const data = soc.snapshot();

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { wss, ingest, snapshot };
