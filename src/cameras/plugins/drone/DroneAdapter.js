export const DroneAdapter = {
  id: "drone",
  name: "Drone Adapter",
  protocol: "drone",
  connect(device) {
    return {
      connected: true,
      adapter: "drone",
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
