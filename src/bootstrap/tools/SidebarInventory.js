import { AfriProducts } from "../registry/ProductRegistry.js";

export function printSidebarInventory(){
  console.log("\n🧭 ===== AFRIDIGITAL SIDEBAR INVENTORY =====");

  const userSidebar = AfriProducts.map(p => p.key);
  const adminSidebar = AfriProducts.map(p => ({
    key: p.key,
    access: "ADMIN_FULL"
  }));

  console.log("\n📱 USER SIDEBAR PRODUCTS:");
  userSidebar.forEach(p => console.log(" -", p));

  console.log("\n🛠️ ADMIN SIDEBAR PRODUCTS:");
  adminSidebar.forEach(p => console.log(" -", p.key, "|", p.access));

  console.log("\n📦 TOTAL PRODUCTS:", AfriProducts.length);
  console.log("\n========================================\n");
}
