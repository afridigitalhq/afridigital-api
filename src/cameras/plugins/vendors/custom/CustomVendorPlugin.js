import { createVendorManifest } from "../manifest/createVendorManifest.js";

export const CustomVendorPlugin = {
  manifest: createVendorManifest({
    id: "custom-vendor",
    name: "Custom Vendor",
    protocols: [],
    deviceTypes: [],
    capabilities: []
  }),

  connect(camera) {
    return {
      connected: true,
      vendor: "custom-vendor",
      camera
    };
  }
};
