import { getVendor } from "./VendorRegistry.js";

export function resolveVendor(id) {
  return getVendor(id);
}

export function hasVendor(id) {
  return resolveVendor(id) !== null;
}
