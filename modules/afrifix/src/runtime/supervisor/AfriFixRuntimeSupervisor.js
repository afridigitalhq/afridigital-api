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

    const transitions = [];
    const advance = state => {
      const result = this.state.transition(state);
      transitions.push(result);
      if(result.status !== "TRANSITIONED") throw new Error(`Invalid AfriFix lifecycle transition: ${state}`);
    };

    advance("PREVIEW");
    advance("APPROVAL");
    advance("QUEUED");

    this.registry.register(execution);

    advance("SCHEDULED");
    advance("EXECUTING");

    const runtime = this.kernel.execute(execution);

    const workerResult =
      runtime?.execution?.execution?.execution?.runtime?.runtime?.executed ||
      runtime?.execution?.execution?.execution?.runtime?.executed ||
      runtime?.execution?.execution?.runtime?.executed ||
      runtime?.execution?.runtime?.executed ||
      null;

    advance("VERIFYING");
    advance("EVIDENCE");
    advance("COMPLETED");

    const finalExecution = {
      ...execution,
      status: "COMPLETED",
      lifecycle: this.state.list(),
      transitions,
      stagesExecuted: workerResult?.stagesExecuted || [],
      workerStatus: workerResult?.status || "UNKNOWN",
      completedAt: workerResult?.completedAt || new Date().toISOString()
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
