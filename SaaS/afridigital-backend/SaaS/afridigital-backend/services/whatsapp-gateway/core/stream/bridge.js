const clients = new Set();

function connect(ws) {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
}

function emit(event) {
  const payload = JSON.stringify(event);

  for (const ws of clients) {
    try {
      ws.send(payload);
    } catch (e) {}
  }
}

module.exports = { connect, emit };
