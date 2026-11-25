import AfriForexLiveEngine from "../../modules/afriforex/live/AfriForexLiveEngine.js";
import AfriNotificationRuntime from "../../modules/platform/notifications/runtime/AfriNotificationRuntime.js";
import AfriNotificationProviders from "../../modules/platform/notifications/providers/AfriNotificationProviders.js";
import { createEventKernel } from "../kernel/eventbus/EventKernelFactory.js";
import { initAfriCCTV } from "../africctv/bootstrap/initAfriCCTV.js";
import { init as initAfriAI } from "../../modules/afriai/bootstrap/index.js";
import { AfriProducts } from "./registry/ProductRegistry.js";
import { loadPlugins } from "./runtime/PluginLoader.js";
import { initializeAfriCrypto } from "../africrypto/AfriCryptoRuntime.js";
import { initializeAfriAgentsEconomy } from "../platform/agent/economy/AfriAgentsEconomyRuntime.js";
import AfriA2AServiceRegistry from "../platform/agent/services/AfriA2AServiceRegistry.js";
import AfriAgentIdentityRegistry from "../platform/agent/identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../platform/agent/registry/AfriAgentCapabilityRegistry.js";
import AfriAgentCapabilityHandlerProvider from "../platform/agent/harness/providers/AfriAgentCapabilityHandlerProvider.js";
import AfriAgentHarnessRuntime from "../platform/agent/harness/runtime/AfriAgentHarnessRuntime.js";
import { createAfriAICommandRuntime } from "../platform/agent/command/AfriAICommandRuntime.js";
import { initializeAfriAgentApprovalRuntime } from "../platform/agent/harness/approval/AfriAgentApprovalRuntime.js";
import AfriAICoderA2AService from "../platform/agent/services/AfriAICoderA2AService.js";
import { createAfriAICoderGenerationAdapter } from "../platform/agent/services/AfriAICoderGenerationAdapter.js";
import { createProductPluginMap } from "./binding/ProductPluginMap.js";
import { printSidebarInventory } from "./tools/SidebarInventory.js";

import { initializeAfriPostgres } from "../platform/database/postgres/AfriPostgresRuntime.js";
import { init as initAfriIdentity } from "../afriidentity/bootstrap/index.js";
import { markAfriAgentPlatformReady } from "../platform/agent/readiness/AfriAgentPlatformReadiness.js";

export async function initAfriDigitalBootstrap(server, realtimeGateway, { requireApprovalRuntime = false } = {}) {
  console.log("🌍 Starting AfriDigital Ecosystem Runtime...");

  const postgresPool = await initializeAfriPostgres();
  if (requireApprovalRuntime && typeof postgresPool?.query !== "function") throw new Error("AFRI_PRODUCTION_POSTGRES_REQUIRED");
  const afriIdentity = postgresPool ? await initAfriIdentity({ pool: postgresPool }) : null;
  if (requireApprovalRuntime && typeof afriIdentity?.sessionService?.verifyPrincipal !== "function") throw new Error("AFRI_PRODUCTION_IDENTITY_SESSION_REQUIRED");

  // ⚡ GLOBAL EVENT KERNEL (single source of truth)
  const eventBus = createEventKernel();
  const afriCrypto = initializeAfriCrypto();

  // Load identities before registering their capabilities and Economy services.
  AfriAgentIdentityRegistry.initializeFromEnv();
  AfriA2AServiceRegistry.initialize();

  // Configure AfriAICoder generation without enabling its capabilities.
  if (!AfriAICoderA2AService.isExecutionAdapterConfigured()) {
    AfriAICoderA2AService.configureExecutionAdapter(
      createAfriAICoderGenerationAdapter()
    );
  }

  const afriAgentsEconomy = initializeAfriAgentsEconomy();

  const capabilityProviderId = "afri-agent-capability-handler-provider";

  if (!AfriAgentHarnessRuntime.getProvider(capabilityProviderId)) {
    AfriAgentHarnessRuntime.registerProvider(
      capabilityProviderId,
      AfriAgentCapabilityHandlerProvider
    );
  }

  for (const agent of AfriAgentIdentityRegistry.list()) {
    if (
      agent.id === "AGENT-AFRIAICOMMAND-001" ||
      agent.provider
    ) {
      continue;
    }

    const hasRegisteredHandler = agent.capabilities.some((capabilityId) => {
      const capability = AfriAgentCapabilityRegistry.get(capabilityId);
      return typeof capability?.handler === "function";
    });

    if (hasRegisteredHandler) {
      AfriAgentIdentityRegistry.bindProvider(
        agent.id,
        capabilityProviderId
      );
    }
  }

  const approvalRuntime = postgresPool && afriIdentity?.sessionService
    ? await initializeAfriAgentApprovalRuntime({
      pool: postgresPool,
      sessionService: afriIdentity.sessionService,
      auditRepository: afriIdentity.repository
    })
    : null;
  if (requireApprovalRuntime && !approvalRuntime) throw new Error("AFRI_PRODUCTION_APPROVAL_RUNTIME_REQUIRED");
  const commandRuntime = approvalRuntime?.commandRuntime || (requireApprovalRuntime ? null : createAfriAICommandRuntime());
  if (!commandRuntime) throw new Error("AFRI_AGENT_COMMAND_RUNTIME_REQUIRED");
  const afriAICommand = commandRuntime.initialize();


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
  AfriNotificationRuntime.init();

  // 📈 AfriForex live market intelligence
  const afriForexLive = AfriForexLiveEngine.start({
    customerId: "guest"
  });

  console.log("🚀 AfriDigital Bootstrap ACTIVE (Kernel Mode)");

  if (approvalRuntime) markAfriAgentPlatformReady({ postgresPool, afriIdentity, approvalRuntime, commandRuntime, commandStatus: afriAICommand });

  return {
    eventBus,
    afriIdentity,
    approvalRuntime,
    afriCrypto,
    afriAgentsEconomy,
    afriAICommand,
    cctv,
    afriai,
    afriForexLive,
    plugins,
    map
  };
}
