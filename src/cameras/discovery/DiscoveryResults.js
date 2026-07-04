export function createDiscoveryResult(device = {}) {
  return {
    id: device.id || null,
    name: device.name || "Unknown Device",
    vendor: device.vendor || null,
    adapter: device.adapter || null,
    protocol: device.protocol || null,
    ip: device.ip || null,
    status: device.status || "DISCOVERED",
    confidence: device.confidence || 0,
    capabilities: device.capabilities || []
  };
}
