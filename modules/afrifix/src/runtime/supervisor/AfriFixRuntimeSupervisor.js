import { AfriFixExecutionContext } from "../context/AfriFixExecutionContext.js";
import { AfriFixExecutionStateMachine } from "../state/AfriFixExecutionStateMachine.js";
import { AfriFixExecutionRegistry } from "../registry/AfriFixExecutionRegistry.js";
import { AfriFixExecutionStore } from "../storage/AfriFixExecutionStore.js";
import { AfriFixRuntimeKernel } from "../kernel/AfriFixRuntimeKernel.js";

export class AfriFixRuntimeSupervisor {
  constructor() {
    this.context = new AfriFixExecutionContext();
    this.state = new AfriFixExecutionStateMachine();
    this.registry = new AfriFixExecutionRegistry();
    this.store = new AfriFixExecutionStore();
    this.kernel = new AfriFixRuntimeKernel();
  }

  execute(request = {}) {
    const execution = this.context.create(request);

    this.registry.register(execution);

    const runtime = this.kernel.execute(execution);

    const finalExecution = {
      ...execution,
      status: "COMPLETED",
      lifecycle: this.state.list()
    };

    this.store.save(finalExecution);

    return {
      component: "AfriFix Runtime Supervisor",
      status: "PASSED",
      execution: finalExecution,
      runtime,
      timestamp: new Date().toISOString()
    };
  }
}
