import Queue from "../../queue/AfriDebugQueue.js";
import Monitor from "../monitoring/AfriDebugLiveMonitor.js";

const AfriDebugAdminRuntime = {
  privileges: "SUPER_ADMIN",

  dashboard() {
    return {
      access: "FULL",
      queue: Queue.stats(),
      monitoring: Monitor.stats(),
      permissions: [
        "developers",
        "projects",
        "repositories",
        "investigations",
        "runtime",
        "logs",
        "knowledge",
        "repairs",
        "billing",
        "credits",
        "subscriptions",
        "apiKeys",
        "organizations",
        "notifications",
        "security",
        "audit",
        "reports",
        "deliveries"
      ],
      timestamp: Date.now()
    };
  },

  health() {
    return {
      service: "AfriDebugAdminRuntime",
      status: "healthy",
      access: this.privileges
    };
  }
};

export default AfriDebugAdminRuntime;
