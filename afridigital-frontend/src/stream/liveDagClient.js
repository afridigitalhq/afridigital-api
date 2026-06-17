const API_URL = process.env.REACT_APP_API_URL || "https://afridigital-api.onrender.com";
const WS_URL = API_URL.replace("https://", "wss://").replace("http://", "ws://");

export function createLiveDagSocket() {
  const socket = new WebSocket(WS_URL);

  const state = {
    connected: false,
    nodes: [],
    regions: [],
    events: []
  };

  socket.onopen = () => {
    state.connected = true;
    socket.send(JSON.stringify({ type: "SUBSCRIBE_DAG_STREAM" }));
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "DAG_UPDATE") {
        state.nodes = data.nodes || [];
      }

      if (data.type === "REGION_HEATMAP") {
        state.regions = data.regions || [];
      }

      if (data.type === "EVENT_TIMELINE") {
        state.events = data.events || [];
      }
    } catch (e) {}
  };

  socket.onclose = () => {
    state.connected = false;
  };

  return { socket, state };
}
