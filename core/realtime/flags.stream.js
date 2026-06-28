let clients = [];

function registerFlagSocket(ws) {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
}

function broadcastFlags(flags) {
  const payload = JSON.stringify({
    type: "FLAGS_UPDATE",
    data: flags
  });

  clients.forEach(ws => {
    try { ws.send(payload); } catch (e) {}
  });
}

module.exports = { registerFlagSocket, broadcastFlags };
