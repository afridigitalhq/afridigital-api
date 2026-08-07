import {AfriNucPipelineRegistryBridge} from "./AfriNucPipelineRegistryBridge.js";

export class AfriNucPipelineDispatcherV2 {

  constructor(){
    this.component = "AfriNuc Pipeline Dispatcher V2";
    this.registry = new AfriNucPipelineRegistryBridge();
    this.history = [];
  }

  dispatch(capability,payload={}){

    const route = this.registry.resolve(capability);

    if(route.status !== "RESOLVED"){
      return {
        component:this.component,
        status:"FAILED",
        reason:"CAPABILITY_NOT_FOUND",
        capability
      };
    }

    const execution = {
      component:this.component,
      status:"DISPATCHED",
      capability,
      handler:route.handler,
      payload,
      dispatchedAt:new Date().toISOString()
    };

    this.history.push(execution);

    return execution;
  }

  list(){

    return {
      component:this.component,
      status:"ACTIVE",
      executions:this.history,
      totalExecutions:this.history.length
    };
  }
}
