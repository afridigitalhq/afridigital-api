let subscribers = [];

function registerHUDClient(ws) {
  subscribers.push(ws);

  ws.on("close", () => {
    subscribers = subscribers.filter(s => s !== ws);
  });
}

function emitHUD(event) {
  const payload = JSON.stringify({
    type: "WEBGL_CI_EVENT",
    event: {
      ...event,
      ts: Date.now()
    }
  });

  subscribers.forEach(ws => {
    try { ws.send(payload); } catch (e) {}
  });
}

module.exports = { registerHUDClient, emitHUD };
