import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const DahuaPlugin = {
  manifest: createVendorManifest({
    id: "dahua",
    name: "Dahua",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","NVR","DVR"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "dahua",
      camera
    };
  }
};
