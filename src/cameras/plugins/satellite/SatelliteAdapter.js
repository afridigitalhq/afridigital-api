export const SatelliteAdapter = {
  id: "satellite",
  name: "Satellite Adapter",
  protocol: "satellite",
  connect(device) {
    return {
      connected: false,
      adapter: "satellite",
      device,
      message: "Reserved for future implementation"
    };
  },
  disconnect() {
    return true;
  },
  status() {
    return "FUTURE";
  }
};
