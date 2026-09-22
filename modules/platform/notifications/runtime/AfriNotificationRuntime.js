import AfriPlatformEventRegistry from "../../events/registry/AfriPlatformEventRegistry.js";
import AfriPlatformEventHandler from "../../events/handlers/AfriPlatformEventHandler.js";
import AfriPlatformEventBus from "../../events/bus/AfriPlatformEventBus.js";

const AfriNotificationRuntime = {
  initialized: false,

  init() {
    if (this.initialized) return { status: "ALREADY_INITIALIZED" };

    for (const event of AfriPlatformEventRegistry.list()) {
      AfriPlatformEventBus.subscribe(event, (payload) => {
        this.handle(event, payload);
      });
    }

    this.initialized = true;
    console.log("🔔 AfriNotificationRuntime ACTIVE");
    return { status: "INITIALIZED" };
  },
  handle(event, payload = {}) {
    if (!AfriPlatformEventRegistry.has(event)) {
      return {
        status: "IGNORED",
        reason: "UNKNOWN_EVENT",
        event
      };
    }

    return AfriPlatformEventHandler.handle(event, payload);
  }
};

export default AfriNotificationRuntime;
