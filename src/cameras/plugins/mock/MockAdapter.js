export const MockAdapter = {
  id: "mock",
  name: "Mock Camera Adapter",
  protocol: "mock",

  connect(camera) {
    return {
      connected: true,
      adapter: "mock",
      camera
    };
  },

  disconnect() {
    return true;
  },

  status() {
    return "READY";
  }
};
