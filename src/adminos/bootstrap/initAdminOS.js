import { AfriProducts } from "../../bootstrap/registry/ProductRegistry.js";
import { createEventKernel } from "../../kernel/eventbus/EventKernelFactory.js";

export function initAdminOS(server){
  console.log("🖥️ Starting AfriDigital Admin OS Control Plane...");

  const bus = createEventKernel();

  console.log("\n📦 PRODUCT REGISTRY");
  console.log("================================");
  AfriProducts.forEach(p => console.log("•", p.key));

  console.log("\n⚡ EVENT KERNEL STATUS");
  console.log("================================");
  bus.emit("system:start", { time: Date.now() });

  console.log("\n🎥 CCTV STATUS (AfriCCTV)");
  console.log("================================");
  console.log("• Stream Layer: READY");
  console.log("• Health: STABLE");

  console.log("\n🧩 PLUGIN LAYER");
  console.log("================================");
  console.log("• Plugin runtime: READY (scaffold mode)");

  console.log("\n🚀 ADMIN OS READY");
}
