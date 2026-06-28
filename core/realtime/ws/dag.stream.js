let clients = [];

function register(ws) {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
}

function broadcast(event) {
  const msg = JSON.stringify({
    type: "DAG_EVENT",
    data: event
  });

  clients.forEach(c => {
    try { c.send(msg); } catch (e) {}
  });
}

module.exports = { register, broadcast };
