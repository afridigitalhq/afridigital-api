import { registerVendor } from "./VendorRegistry.js";

export function loadVendor(plugin) {
  return registerVendor(plugin);
}

export function loadVendors(plugins = []) {
  return plugins.map(registerVendor);
}
