import { AfriNucCapabilityRegistry } from "./AfriNucCapabilityRegistry.js";

export class AfriNucRuntimeCapabilityBridge {

  constructor(){

    this.component = "AfriNuc Runtime Capability Bridge";
    this.registry = new AfriNucCapabilityRegistry();

  }

  discover(){

    const result = this.registry.list();

    return {
      component:this.component,
      status:"DISCOVERED",
      runtime:"AfriNucChain Runtime",
      capabilities:result.capabilities,
      totalCapabilities:result.totalCapabilities,
      discoveredAt:new Date().toISOString()
    };

  }

  activate(capability){

    const result=this.registry.register(capability);

    return {
      component:this.component,
      status:"ACTIVATED",
      capability,
      totalCapabilities:result.totalCapabilities
    };

  }

}
