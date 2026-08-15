import { AfriFixExecutionContext } from "../context/AfriFixExecutionContext.js";
import { AfriFixExecutionStateMachine } from "../state/AfriFixExecutionStateMachine.js";
import { AfriFixExecutionRegistry } from "../registry/AfriFixExecutionRegistry.js";
import { AfriFixExecutionStore } from "../storage/AfriFixExecutionStore.js";
import { AfriFixRuntimeKernel } from "../kernel/AfriFixRuntimeKernel.js";
import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";
import AfriFixRuntimeEvidenceAdapter from "../adapters/AfriFixRuntimeEvidenceAdapter.js";
import { AfriFixRuntimeSnapshotEngine } from "../snapshots/AfriFixRuntimeSnapshotEngine.js";

export class AfriFixRuntimeSupervisor {
  constructor() {
    this.context = new AfriFixExecutionContext();
    this.state = new AfriFixExecutionStateMachine();
    this.registry = new AfriFixExecutionRegistry();
    this.store = new AfriFixExecutionStore();
    this.kernel = new AfriFixRuntimeKernel();
    this.events = new AfriFixRuntimeEventStore();
    this.snapshots = new AfriFixRuntimeSnapshotEngine();
  }

  execute(request = {}) {
    this.state = new AfriFixExecutionStateMachine();
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

    const eventPayload = { executionId: execution.executionId, module: execution.module, action: execution.action };

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

    this.events.publish("EVIDENCE_GENERATED", { executionId: execution.executionId, module: execution.module, action: execution.action, workspace: execution.workspace, status: "COMPLETED" });

    const evidence = AfriFixRuntimeEvidenceAdapter.store({
      executionId: execution.executionId,
      module: execution.module,
      action: execution.action,
      workspace: execution.workspace,
      status: "COMPLETED",
      lifecycle: this.state.list(),
      transitions,
      stagesExecuted: workerResult?.stagesExecuted || [],
      workerStatus: workerResult?.status || "UNKNOWN",
      evidenceType: "AfriFix Runtime Execution Evidence"
    });


    advance("COMPLETED");

    const finalExecution = {
      ...execution,
      status: "COMPLETED",
      lifecycle: this.state.list(),
      transitions,
      stagesExecuted: workerResult?.stagesExecuted || [],
      workerStatus: workerResult?.status || "UNKNOWN",
      evidence,
      completedAt: workerResult?.completedAt || new Date().toISOString()
    };

    this.store.save(finalExecution);

    const snapshot = this.snapshots.save({
      executionId: execution.executionId,
      module: execution.module,
      action: execution.action,
      workspace: execution.workspace,
      status: finalExecution.status,
      gatewayStatus: "EXECUTED",
      runtimeStatus: runtime?.status || "UNKNOWN",
      evidenceStatus: evidence?.status || "UNKNOWN",
      lifecycle: finalExecution.lifecycle,
      stagesExecuted: finalExecution.stagesExecuted,
      capturedAt: new Date().toISOString()
    });

    return {
      component: "AfriFix Runtime Supervisor",
      status: "PASSED",
      execution: finalExecution,
      runtime,
      timestamp: new Date().toISOString()
    };
  }
}
