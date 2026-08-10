import { AfriFixCapabilityRegistry } from "./AfriFixCapabilityRegistry.js";

export class AfriFixCapabilityResolver {
  constructor(){
    this.registry=new AfriFixCapabilityRegistry();
  }

  resolve(request={}){
    const moduleName=String(request.module||"").toLowerCase();
    const supported=this.registry.supports(moduleName,request.action);

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
