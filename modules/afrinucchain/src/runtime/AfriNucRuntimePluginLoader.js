import { AfriNucRuntimeCapabilityBridge } from "./AfriNucRuntimeCapabilityBridge.js";

export class AfriNucRuntimePluginLoader {

  constructor(){

    this.component="AfriNuc Runtime Plugin Loader";
    this.bridge=new AfriNucRuntimeCapabilityBridge();

  }

  load(){

    const discovery=this.bridge.discover();

    const plugins=discovery.capabilities.map(capability=>({
      name:capability,
      status:"AVAILABLE",
      loadedAt:new Date().toISOString()
    }));

    return {
      component:this.component,
      status:"LOADED",
      runtime:discovery.runtime,
      totalPlugins:plugins.length,
      plugins
    };

  }

}
