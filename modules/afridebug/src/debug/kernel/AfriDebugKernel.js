import AdminRuntime from "../admin/runtime/AfriDebugAdminRuntime.js";
import Scheduler from "../scheduler/AfriDebugJobScheduler.js";
import Queue from "../queue/AfriDebugQueue.js";
import Monitor from "../admin/monitoring/AfriDebugLiveMonitor.js";
import RuntimeBootstrap from "../runtime/AfriDebugRuntimeBootstrap.js";

const AfriDebugKernel = {
  boot() {
    return {
      service: "AfriDebugKernel",
      status: "ONLINE",
      bootedAt: Date.now(),
      runtimeRegistry: RuntimeBootstrap.boot(),
      runtimes: {
        admin: AdminRuntime.health(),
        scheduler: typeof Scheduler.runNext === "function",
        queue: Queue.stats(),
        monitoring: Monitor.stats()
      }
    };
  }
};

export default AfriDebugKernel;
