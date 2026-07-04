import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const UniviewPlugin = {
  manifest: createVendorManifest({
    id: "uniview",
    name: "Uniview",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","NVR"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "uniview",
      camera
    };
  }
};
