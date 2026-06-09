export function connectAfriscanStream(onData) {
  const ws = new WebSocket("ws://localhost:9090");

  ws.onopen = () => {
    console.log("🧠 AFRISCAN UI CONNECTED");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onData(data);
    } catch (e) {
      console.error("Stream parse error", e);
    }
  };

  ws.onclose = () => {
    console.log("🔴 AFRISCAN DISCONNECTED");
  };

  return ws;
}
