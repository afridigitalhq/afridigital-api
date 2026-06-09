/**
 * 🌐 AFRISCAN WS CLIENT BRIDGE (FRONTEND READY)
 */

function connectAfriscanWS() {
  const ws = new WebSocket("ws://localhost:9090/ws");

  ws.onopen = () => {
    console.log("🧠 CONTROL TOWER CONNECTED");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("📡 AFRISCAN STREAM:", data);
  };

  ws.onerror = (err) => {
    console.error("WS ERROR:", err);
  };

  return ws;
}

module.exports = {
  connectAfriscanWS
};
