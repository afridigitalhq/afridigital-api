import { AfriFixRuntimeSupervisor } from "../supervisor/AfriFixRuntimeSupervisor.js";
import { AfriFixRuntimeSnapshotEngine } from "../snapshots/AfriFixRuntimeSnapshotEngine.js";

export class AfriFixWorkflowOrchestrator {
  constructor() {
    this.supervisor = new AfriFixRuntimeSupervisor();
    this.snapshots = new AfriFixRuntimeSnapshotEngine();
  }

  execute(request = {}) {
    const execution = this.supervisor.execute(request);

    const snapshot = this.snapshots.save({
      executionId: execution.execution.executionId,
      module: request.module,
      action: request.action,
      workspace: request.workspace || "default",
      state: execution.status
    });

    return {
      component: "AfriFix Workflow Orchestrator",
      status: "PASSED",
      architecture: "Global Workflow Orchestrator",
      workflow: [
        "Preview",
        "Approve",
        "Execute",
        "Verify",
        "Evidence",
        "Snapshot"
      ],
      execution,
      snapshot,
      completedAt: new Date().toISOString()
    };
  }
}
