const clients = new Set();

function subscribe(ws) {
  clients.add(ws);
}

function publish(data) {
  for (const ws of clients) {
    try {
      ws.send(JSON.stringify(data));
    } catch (e) {}
  }
}

module.exports = { subscribe, publish };
