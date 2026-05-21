const ws = new WebSocket("wss://afridigital-api.onrender.com");

ws.onopen = () => {
  console.log("🟢 EVENT STREAM CONNECTED");
};

ws.onmessage = (msg) => {
  const event = JSON.parse(msg.data);
  console.log("📡 LIVE EVENT:", event);
};

ws.onclose = () => {
  console.log("🔴 EVENT STREAM DISCONNECTED");
};
