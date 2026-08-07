import { AfriFixRepairLifecycle } from "../lifecycle/AfriFixRepairLifecycle.js";

export class AfriFixWorkflowOrchestrator {
  constructor() {
    this.lifecycle = new AfriFixRepairLifecycle();
  }

  run(context = {}) {
    return this.lifecycle.execute(context);
  }
}
