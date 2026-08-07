import { AfriFixCapabilityResolver } from "../capabilities/AfriFixCapabilityResolver.js";

export class AfriFixExecutionPlanner {
  constructor(){
    this.capability=new AfriFixCapabilityResolver();
  }

  plan(request={}){
    const capability=this.capability.resolve(request);

    if(capability.status!=="RESOLVED"){
      return{
        component:"AfriFix Execution Planner",
        status:"REJECTED",
        reason:"Unsupported Capability",
        capability,
        timestamp:new Date().toISOString()
      };
    }

    const stages=[
      "Preview",
      "Approve",
      "Execute",
      "Verify"
    ];

    if(request.action==="repair") stages.push("Evidence");
    if(request.action==="certify") stages.push("Certification");

    return{
      component:"AfriFix Execution Planner",
      status:"PLANNED",
      executionPlan:{
        executionId:`plan-${Date.now()}`,
        module:request.module,
        action:request.action,
        pipeline:capability.pipeline,
        stages
      },
      timestamp:new Date().toISOString()
    };
  }
}
