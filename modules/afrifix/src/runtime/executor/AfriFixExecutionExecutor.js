import { AfriFixExecutionPlanner } from "../planner/AfriFixExecutionPlanner.js";
import { AfriFixRuntimeSupervisor } from "../supervisor/AfriFixRuntimeSupervisor.js";

export class AfriFixExecutionExecutor {
  constructor() {
    this.planner = new AfriFixExecutionPlanner();
    this.supervisor = new AfriFixRuntimeSupervisor();
  }

  execute(request = {}) {
    const plan = this.planner.plan(request);

    if (plan.status !== "PLANNED") {
      return {
        component: "AfriFix Execution Executor",
        status: "REJECTED",
        plan,
        timestamp: new Date().toISOString()
      };
    }

    const runtime = this.supervisor.execute({
      executionId: plan.executionPlan.executionId,
      ...request
    });

    return {
      component: "AfriFix Execution Executor",
      status: "EXECUTED",
      plan,
      runtime,
      completedAt: new Date().toISOString()
    };
  }
}
