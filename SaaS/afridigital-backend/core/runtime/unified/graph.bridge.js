const { subscribe } = require("./event.bus");

function attachWS(wss) {
  subscribe((event) => {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(event));
      }
    });
  });
}

module.exports = { attachWS };
