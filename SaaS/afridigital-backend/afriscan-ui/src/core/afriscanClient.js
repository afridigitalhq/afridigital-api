export function connectAfriscan() {
  const ws = new WebSocket("ws://localhost:9090");

  ws.onmessage = (event) => {
    console.log("🧠 AFRISCAN SCAN EVENT:", event.data);
  };

  return ws;
}
