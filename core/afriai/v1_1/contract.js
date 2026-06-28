
module.exports = {
  version: "v1.1",
  mode: "interaction-only",
  streaming: true,
  websocket: "/ws/afriai",
  route: "/api/afriai/ask",
  schema: {
    intent: "string",
    reply: "string",
    ts: "number"
  },
  restrictions: {
    noKernelMutation: true,
    noSelfUpgrade: true
  }
};
