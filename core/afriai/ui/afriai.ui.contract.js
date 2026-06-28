module.exports = {
  version: "v1.1",
  mode: "stream-ui-only",
  websocket: "/ws/afriai",
  route: "/api/afriai/ask",
  memory: false,
  voice: false,
  logNoiseFilter: true,
  responseSchema: {
    success: true,
    layer: "afriai-ui-v1.1",
    intent: "",
    reply: "",
    ts: 0
  }
};
