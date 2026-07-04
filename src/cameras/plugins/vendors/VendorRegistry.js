const vendors = new Map();

export function registerVendor(plugin) {
  vendors.set(plugin.id, plugin);
  return plugin;
}

export function unregisterVendor(id) {
  return vendors.delete(id);
}

export function getVendor(id) {
  return vendors.get(id) || null;
}

export function getAllVendors() {
  return Array.from(vendors.values());
}
