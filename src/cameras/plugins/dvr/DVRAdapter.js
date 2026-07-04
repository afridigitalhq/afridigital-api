export const DVRAdapter = {
  id: "dvr",
  name: "DVR Adapter",
  protocol: "dvr",
  connect(device) {
    return {
      connected: true,
      adapter: "dvr",
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
