/**
 * 📡 SAFE WHATSAPP RESTART HOOK
 * Prevents downtime during deploy
 */

function notifyRestart(wss) {
  if (!wss) return;

  const msg = JSON.stringify({
    type: "system_event",
    event: "RESTARTING",
    ts: Date.now()
  });

  wss.clients.forEach((c) => {
    if (c.readyState === 1) {
      c.send(msg);
    }
  });
}

module.exports = { notifyRestart };
