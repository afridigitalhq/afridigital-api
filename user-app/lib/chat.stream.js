export function createChatStream(onEvent) {
  const socket = new WebSocket("wss://afridigital-fmdash.onrender.com");

  socket.onopen = () => {
    console.log("🧠 Chat stream connected");
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      onEvent(data);
    } catch (e) {}
  };

  socket.onerror = (e) => {
    console.log("⚠️ Chat stream error", e);
  };

  return {
    send: (payload) => {
      socket.send(JSON.stringify(payload));
    }
  };
}
