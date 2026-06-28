let clients = [];

function registerDAGSocket(ws) {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
}

function broadcastDAG(event) {
  const payload = JSON.stringify({
    type: "DAG_EVENT",
    event
  });

  clients.forEach(ws => {
    try { ws.send(payload); } catch (e) {}
  });
}

module.exports = { registerDAGSocket, broadcastDAG };
