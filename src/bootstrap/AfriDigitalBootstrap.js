import AfriForexLiveEngine from "../../modules/afriforex/live/AfriForexLiveEngine.js";
import AfriNotificationRuntime from "../../modules/platform/notifications/runtime/AfriNotificationRuntime.js";
import AfriNotificationProviders from "../../modules/platform/notifications/providers/AfriNotificationProviders.js";
import AfriWhatsAppNotificationProvider from "../../modules/platform/notifications/providers/AfriWhatsAppNotificationProvider.js";
import { createEventKernel } from "../kernel/eventbus/EventKernelFactory.js";
import { initAfriCCTV } from "../africctv/bootstrap/initAfriCCTV.js";
import { init as initAfriAI } from "../../modules/afriai/bootstrap/index.js";
import { AfriProducts } from "./registry/ProductRegistry.js";
import { loadPlugins } from "./runtime/PluginLoader.js";
import { createProductPluginMap } from "./binding/ProductPluginMap.js";
import { printSidebarInventory } from "./tools/SidebarInventory.js";

export async function initAfriDigitalBootstrap(server, realtimeGateway) {
  console.log("🌍 Starting AfriDigital Ecosystem Runtime...");

  // ⚡ GLOBAL EVENT KERNEL (single source of truth)
  const eventBus = createEventKernel();

  eventBus.emit("system:start", { status: "booting" });

  // 📡 CCTV (isolated domain emitter only)
  const cctv = initAfriCCTV(server, eventBus, realtimeGateway);

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

  // 🔔 Notification runtime — canonical platform event bus subscriber
  AfriNotificationProviders.register("afriWhatsApp", AfriWhatsAppNotificationProvider);
  console.log("📲 AfriWhatsApp notification provider REGISTERED");
  AfriNotificationRuntime.init();

  // 📈 AfriForex live market intelligence
  const afriForexLive = AfriForexLiveEngine.start({
    customerId: "guest"
  });

  console.log("🚀 AfriDigital Bootstrap ACTIVE (Kernel Mode)");

  return {
    eventBus,
    cctv,
    afriai,
    afriForexLive,
    plugins,
    map
  };
}
