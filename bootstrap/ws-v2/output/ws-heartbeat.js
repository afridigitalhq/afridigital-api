
function createHeartbeat(ws) {
  return setInterval(() => {
    ws.send(JSON.stringify({
      type: "heartbeat",
      ts: Date.now()
    }));
  }, 5000);
}

module.exports = { createHeartbeat };
