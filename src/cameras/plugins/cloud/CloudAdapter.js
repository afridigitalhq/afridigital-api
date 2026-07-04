export const CloudAdapter = {
  id: "cloud",
  name: "Cloud Adapter",
  protocol: "cloud",
  connect(device) {
    return {
      connected: true,
      adapter: "cloud",
      device
    };
  },
  disconnect() {
    return true;
  },
  status() {
    return "READY";
  }
};
