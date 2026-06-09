export const connectAfriscan = () => {
  const ws = new WebSocket("ws://localhost:9090");

  ws.onopen = () => {
    console.log("🧠 AFRISCAN CONTROL TOWER CONNECTED");
  };

  return ws;
};
