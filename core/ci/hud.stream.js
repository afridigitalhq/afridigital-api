let listeners = [];

function registerHUD(ws) {
  listeners.push(ws);
}

function pushCI(event) {
  const msg = JSON.stringify({ type: "CI_UPDATE", event });
  listeners.forEach(ws => {
    try { ws.send(msg); } catch (e) {}
  });
}

module.exports = { registerHUD, pushCI };
