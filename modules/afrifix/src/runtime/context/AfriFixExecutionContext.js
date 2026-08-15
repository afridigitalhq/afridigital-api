import { AfriFixRuntimeEventStore } from "../eventstore/AfriFixRuntimeEventStore.js";

export class AfriFixExecutionContext {
  constructor(){
    this.events=new AfriFixRuntimeEventStore();
  }

  create(request={}){
    const execution={
      component:"AfriFix Execution Context",
      status:"READY",
      executionId:request.executionId||`exec-${Date.now()}`,
      module:request.module||"unknown",
      action:request.action||"unknown",
      executionPlan:request.executionPlan||null,
      workspace:request.workspace||"default",
      approvalRequired:request.approvalRequired??true,
      evidenceRequired:request.evidenceRequired??true,
      createdAt:new Date().toISOString()
    };

    this.events.publish("EXECUTION_CREATED",execution);
    return execution;
  }
}
