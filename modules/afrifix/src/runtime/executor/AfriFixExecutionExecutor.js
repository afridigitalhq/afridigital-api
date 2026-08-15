import { AfriFixExecutionPlanner } from "../planner/AfriFixExecutionPlanner.js";
import { AfriFixRuntimeSupervisor } from "../supervisor/AfriFixRuntimeSupervisor.js";
import { AfriFixExecutionPolicy } from "../../kernel/policies/AfriFixExecutionPolicy.js";

export class AfriFixExecutionExecutor {
  constructor() {
    this.policy = new AfriFixExecutionPolicy();
    this.planner = new AfriFixExecutionPlanner();
    this.supervisor = new AfriFixRuntimeSupervisor();
  }

  execute(request = {}) {
    const policy = this.policy.evaluate(request);

    if (policy.status !== "APPROVED") {
      return {
        component: "AfriFix Execution Executor",
        status: "REJECTED",
        reason: "Execution Policy Denied",
        policy,
        timestamp: new Date().toISOString()
      };
    }

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
      ...request,
      executionId: plan.executionPlan.executionId,
      executionPlan: plan.executionPlan
    });

    return {
      component: "AfriFix Execution Executor",
      status: "EXECUTED",
      policy,
      plan,
      runtime,
      completedAt: new Date().toISOString()
    };
  }
}
