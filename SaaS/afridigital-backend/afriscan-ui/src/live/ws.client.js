/**
 * 🌐 AFRISCAN LIVE WS CLIENT (REACT SIDE)
 */

export function connectAfriscan(setEvents) {
  const ws = new WebSocket("ws://localhost:9090");

  ws.onopen = () => {
    console.log("🧠 AFRISCAN CONTROL TOWER CONNECTED");
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      setEvents(prev => [data, ...prev].slice(0, 100));
    } catch (e) {
      console.log("WS parse error:", e);
    }
  };

  ws.onerror = (err) => {
    console.error("WS ERROR:", err);
  };

  return ws;
}
