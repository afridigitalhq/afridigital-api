import { globalState } from "../kernel/state/globalState.js";
import { snapshotEngine } from "../kernel/snapshot/snapshotEngine.js";
import { commandBus } from "../kernel/commandBus.js";
import { intentParser } from "../kernel/intentParser.js";
import { uiContract } from "../kernel/contract/uiContract.js";

import { identity } from "../kernel/identity/identity.js";
import { whatsappIdentityBridge } from "../kernel/distributed/whatsapp/whatsappIdentityBridge.js";

export function bootstrapOS() {
  globalState.init();
  snapshotEngine.init();
  commandBus.init();
  intentParser.init();
  uiContract.init();

  // default anonymous identity until WhatsApp binds
  identity.set({ id: "guest", role: "user" });

  whatsappIdentityBridge.init();

  console.log("🌐 V24 AUTHENTICATED DISTRIBUTED AI SYSTEM ACTIVE");
}
