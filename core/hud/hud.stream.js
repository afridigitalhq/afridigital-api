let clients = [];

function registerHUD(ws) {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
}

function broadcastHUD(payload) {
  const msg = JSON.stringify({ type: "HUD_EVENT", payload });

  clients.forEach(c => {
    try { c.send(msg); } catch (e) {}
  });
}

module.exports = { registerHUD, broadcastHUD };
