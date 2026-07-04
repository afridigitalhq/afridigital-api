export function createVendorManifest(config) {
  return {
    id: config.id,
    name: config.name,
    version: config.version || "1.0.0",
    protocols: config.protocols || [],
    deviceTypes: config.deviceTypes || [],
    capabilities: config.capabilities || []
  };
}
