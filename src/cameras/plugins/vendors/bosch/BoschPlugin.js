import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const BoschPlugin = {
  manifest: createVendorManifest({
    id: "bosch",
    name: "Bosch",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","NVR","Encoder"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection","Audio","Analytics"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "bosch",
      camera
    };
  }
};
