export const GenericRTSPPlugin = {
  id: "generic-rtsp",
  name: "Generic RTSP",
  adapter: "rtsp",
  supports: ["RTSP"],
  connect(camera) {
    return {
      connected: true,
      plugin: "generic-rtsp",
      camera
    };
  }
};
