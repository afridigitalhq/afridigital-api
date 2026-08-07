import { AfriFixJobQueue } from "../queue/AfriFixJobQueue.js";
import { AfriFixScheduler } from "../scheduler/AfriFixScheduler.js";
import { AfriFixWorker } from "../workers/AfriFixWorker.js";
import { AfriFixExecutionPlanner } from "../planner/AfriFixExecutionPlanner.js";

export class AfriFixRuntimeDispatcher {
  constructor() {
    this.queue = new AfriFixJobQueue();
    this.scheduler = new AfriFixScheduler();
    this.worker = new AfriFixWorker();
    this.planner = new AfriFixExecutionPlanner();
  }

  dispatch(request = {}) {
    const plan=this.planner.plan(request); if(plan.status!=="PLANNED") return {component:"AfriFix Runtime Dispatcher",status:"REJECTED",plan}; const job=this.queue.enqueue({...request,executionId:plan.executionPlan.executionId,stages:plan.executionPlan.stages});
    const scheduled = this.scheduler.schedule(job);
    const executed = this.worker.execute({...job,stages:request.stages||job.stages||["Execute"]});

    return {
      component: "AfriFix Runtime Dispatcher",
      status: "PASSED",
      job,
      scheduled,
      executed
    };
  }
}
