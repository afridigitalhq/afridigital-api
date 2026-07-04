import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const HanwhaPlugin = {
  manifest: createVendorManifest({
    id: "hanwha",
    name: "Hanwha Vision",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","NVR","Encoder"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection","Audio","Analytics"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "hanwha",
      camera
    };
  }
};
