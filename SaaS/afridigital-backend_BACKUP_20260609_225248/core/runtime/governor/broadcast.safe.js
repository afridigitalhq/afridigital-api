/**
 * 🧠 SAFE BROADCAST LAYER
 * wraps WS broadcast with governance
 */

const { shouldEmit } = require("./event.governor");

let _wss = null;

function attach(serverInstance) {
  _wss = serverInstance;
}

function broadcast(event) {
  if (!shouldEmit(event)) return;

  if (!_wss) return;

  _wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(event));
    }
  });
}

module.exports = {
  attach,
  broadcast
};
