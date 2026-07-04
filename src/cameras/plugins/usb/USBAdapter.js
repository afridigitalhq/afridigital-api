export const USBAdapter = {
  id: "usb",
  name: "USB Adapter",
  protocol: "usb",
  connect(device) {
    return {
      connected: true,
      adapter: "usb",
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
