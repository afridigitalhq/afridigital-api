export const NVRAdapter = {
  id: "nvr",
  name: "NVR Adapter",
  protocol: "nvr",
  connect(device) {
    return {
      connected: true,
      adapter: "nvr",
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
