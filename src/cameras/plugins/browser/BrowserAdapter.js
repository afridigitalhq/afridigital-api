export const BrowserAdapter = {
  id: "browser",
  name: "Browser Adapter",
  protocol: "browser",
  connect(device) {
    return {
      connected: true,
      adapter: "browser",
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
