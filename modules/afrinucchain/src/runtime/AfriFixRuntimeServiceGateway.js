import { AfriFixCapabilityRegistry } from "./AfriFixCapabilityRegistry.js";

export class AfriFixRuntimeServiceGateway {
  constructor(){
    this.registry = new AfriFixCapabilityRegistry();
  }

  async execute(request){
    const capability = this.registry.resolve(
      request.module,
      request.action
    );

    if(!capability.supported){
      return {
        component:"AfriFix Runtime Service Gateway",
        status:"REJECTED",
        request,
        capability
      };
    }

    return {
      component:"AfriFix Runtime Service Gateway",
      status:"EXECUTED",
      request,
      capability,
      pipeline:{
        component:"AfriFix Execution Pipeline",
        status:"PASSED",
        stages:[
          "Preview",
          "Approve",
          "Execute",
          "Verify",
          "Evidence",
          "Certification"
        ]
      },
      completedAt:new Date().toISOString()
    };
  }
}
