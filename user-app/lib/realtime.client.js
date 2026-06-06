export function createRealtimeClient(onEvent) {
  const socket = new WebSocket("wss://afridigital-hub.onrender.com");

  socket.onopen = () => {
    console.log("🧠 Connected to AfriDigital event stream");
  };

  socket.onmessage = (msg) => {
    try {
      const event = JSON.parse(msg.data);
      onEvent(event);
    } catch (e) {
      console.log("Invalid event payload");
    }
  };

  socket.onerror = (err) => {
    console.log("⚠️ Realtime connection error", err);
  };

  return {
    send: (payload) => {
      socket.send(JSON.stringify(payload));
    }
  };
}
