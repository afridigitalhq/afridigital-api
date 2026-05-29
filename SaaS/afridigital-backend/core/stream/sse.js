const clients = new Map();

function registerClient(id, res) {
  clients.set(id, res);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  res.write(`data: {"type":"connected"}\n\n`);
}

function pushEvent(id, event) {
  const res = clients.get(id);
  if (!res) return;

  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

function removeClient(id) {
  clients.delete(id);
}

module.exports = { registerClient, pushEvent, removeClient };
