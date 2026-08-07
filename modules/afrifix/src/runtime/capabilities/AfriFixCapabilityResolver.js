import { AfriFixCapabilityRegistry } from "./AfriFixCapabilityRegistry.js";

export class AfriFixCapabilityResolver {
  constructor(){
    this.registry=new AfriFixCapabilityRegistry();
  }

  resolve(request={}){
    const supported=this.registry.supports(request.module,request.action);

    return {
      component:"AfriFix Capability Resolver",
      status:supported?"RESOLVED":"UNSUPPORTED",
      module:request.module,
      action:request.action||"unknown",
      supported,
      pipeline:supported?"AfriFix Execution Pipeline":null,
      timestamp:new Date().toISOString()
    };
  }

  list(){
    return this.registry.list();
  }
}
