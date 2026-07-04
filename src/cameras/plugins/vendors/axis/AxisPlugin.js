import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const AxisPlugin = {
  manifest: createVendorManifest({
    id: "axis",
    name: "Axis",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","Encoder"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection","Audio"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "axis",
      camera
    };
  }
};
