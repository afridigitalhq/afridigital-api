export const GenericONVIFPlugin = {
  id: "generic-onvif",
  name: "Generic ONVIF",
  adapter: "onvif",
  supports: ["ONVIF"],
  connect(camera) {
    return {
      connected: true,
      plugin: "generic-onvif",
      camera
    };
  }
};
