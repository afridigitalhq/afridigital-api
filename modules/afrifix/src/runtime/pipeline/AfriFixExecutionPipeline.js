import { AfriFixRuntimeManager } from "../manager/AfriFixRuntimeManager.js";
import { AfriFixRuntimeMonitor } from "../monitor/AfriFixRuntimeMonitor.js";

export class AfriFixExecutionPipeline {
  execute(request = {}) {
    const manager = new AfriFixRuntimeManager();
    const runtime = manager.execute(request);

    const monitor = new AfriFixRuntimeMonitor();
    const health = monitor.inspect(runtime.runtime);

    return {
      component: "AfriFix Execution Pipeline",
      status: "PASSED",
      request,
      runtime,
      health,
      completedAt: new Date().toISOString()
    };
  }
}
