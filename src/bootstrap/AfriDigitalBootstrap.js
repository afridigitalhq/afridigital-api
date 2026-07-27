import { createEventKernel } from "../kernel/eventbus/EventKernelFactory.js";
import { initAfriCCTV } from "../africctv/bootstrap/initAfriCCTV.js";
import { init as initAfriAI } from "../../modules/afriai/bootstrap/index.js";
import { AfriProducts } from "./registry/ProductRegistry.js";
import { loadPlugins } from "./runtime/PluginLoader.js";
import { createProductPluginMap } from "./binding/ProductPluginMap.js";
import { printSidebarInventory } from "./tools/SidebarInventory.js";

export async function initAfriDigitalBootstrap(server) {
  console.log("🌍 Starting AfriDigital Ecosystem Runtime...");

  // ⚡ GLOBAL EVENT KERNEL (single source of truth)
  const eventBus = createEventKernel();

  eventBus.emit("system:start", { status: "booting" });

  // 📡 CCTV (isolated domain emitter only)
  const cctv = initAfriCCTV(server, eventBus);

  // 🧠 AfriAI lifecycle registration
  const afriai = initAfriAI(server);

  // 🔌 Plugins
  const plugins = await loadPlugins();

  // 🔗 Product ↔ Plugin binding
  const map = createProductPluginMap(plugins);

  // 📦 Registry output
  console.log("📦 Products:", AfriProducts.length);
  printSidebarInventory();

  // 🧠 System state
  console.log("🔗 Plugin bindings:", Object.keys(map).length);

  eventBus.emit("system:ready", { products: AfriProducts.length });

  console.log("🚀 AfriDigital Bootstrap ACTIVE (Kernel Mode)");

  return {
    eventBus,
    cctv,
    afriai,
    plugins,
    map
  };
}
