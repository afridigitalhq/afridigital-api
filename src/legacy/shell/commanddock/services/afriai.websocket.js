let socket = null;

export function getAfriAISocket() {
  if (socket) return socket;

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host;

  socket = new WebSocket(`${protocol}://${host}/ws/afriai`);

  socket.onopen = () => console.log("🧠 AfriAI WS Connected");
  socket.onclose = () => console.log("🟡 AfriAI WS Disconnected");
  socket.onerror = () => console.log("🔴 AfriAI WS Error");

  return socket;
}

export function sendAfriAI(message) {
  const ws = getAfriAISocket();

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: "chat",
      message
    }));
  }
}
