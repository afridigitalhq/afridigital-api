import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const HikvisionPlugin = {
  manifest: createVendorManifest({
    id: "hikvision",
    name: "Hikvision",
    protocols: ["RTSP","ONVIF"],
    deviceTypes: ["Camera","NVR","DVR"],
    capabilities: ["Live View","Recording","PTZ","Motion Detection"]
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "hikvision",
      camera
    };
  }
};
