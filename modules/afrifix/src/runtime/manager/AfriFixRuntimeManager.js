import { AfriFixExecutionPlanner } from "../planner/AfriFixExecutionPlanner.js";
import { AfriFixRuntimeDispatcher } from "../dispatcher/AfriFixRuntimeDispatcher.js";

export class AfriFixRuntimeManager{
  constructor(){
    this.planner=new AfriFixExecutionPlanner();
    this.dispatcher=new AfriFixRuntimeDispatcher();
  }

  execute(request={}){
    const plan=request.executionPlan ? {status:"PLANNED",executionPlan:request.executionPlan} : this.planner.plan(request);

    if(plan.status!=="PLANNED"){
      return plan;
    }

    return{
      component:"AfriFix Runtime Manager",
      status:"READY",
      workflow:plan.executionPlan.stages.join(" -> "),
      plan:plan.executionPlan,
      runtime:this.dispatcher.dispatch({
        ...request,
        executionId:plan.executionPlan.executionId
      }),
      timestamp:new Date().toISOString()
    };
  }
}
