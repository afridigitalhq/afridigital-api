const { emit } = require("../spine/ci.spine");

let clients = [];

function register(ws) {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
}

function pushHud(event) {
  const node = {
    type: "HUD_EVENT",
    node: event.type,
    state: event.state || "UNKNOWN",
    meta: event
  };

  emit(event);

  const msg = JSON.stringify(node);
  clients.forEach(c => {
    try { c.send(msg); } catch (e) {}
  });

  return node;
}

module.exports = { register, pushHud };
