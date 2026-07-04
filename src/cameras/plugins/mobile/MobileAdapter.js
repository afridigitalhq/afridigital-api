export const MobileAdapter = {
  id: "mobile",
  name: "Mobile Adapter",
  protocol: "mobile",
  connect(device) {
    return {
      connected: true,
      adapter: "mobile",
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
