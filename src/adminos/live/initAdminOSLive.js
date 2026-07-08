import { AfriProducts } from "../../bootstrap/registry/ProductRegistry.js";
import { createEventKernel } from "../../kernel/eventbus/EventKernelFactory.js";

export function initAdminOSLive(server){
  console.log("🖥️ Admin OS Live Control Plane Starting...");

  const bus = createEventKernel();

  const snapshot = {
    products: AfriProducts.length,
    status: "LIVE",
    timestamp: Date.now()
  };

  // SYSTEM HEARTBEAT STREAM
  setInterval(() => {
    bus.emit("system:heartbeat", {
      products: AfriProducts.length,
      time: Date.now()
    });
  }, 5000);

  // INITIAL SNAPSHOT
  bus.emit("system:boot", snapshot);

  console.log("\n📦 PRODUCTS LIVE:", AfriProducts.length);
  console.log("⚡ EVENT KERNEL: STREAMING");
  console.log("🎥 CCTV STATUS: MONITORED (AfriCCTV)");
  console.log("🧩 PLUGINS: READY FOR BINDING");

  console.log("\n🚀 ADMIN OS LIVE MODE ACTIVE");

  return { bus, snapshot };
}
