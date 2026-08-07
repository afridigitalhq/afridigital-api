import fs from "fs";
import path from "path";
import { AfriFixGlobalRuntimeRegistry } from "../global/AfriFixGlobalRuntimeRegistry.js";

export class AfriFixRuntimeModuleDiscovery {
  constructor(root="modules"){
    this.root=root;
    this.registry=new AfriFixGlobalRuntimeRegistry();
  }

  discover(){
    if(!fs.existsSync(this.root)){
      return {
        component:"AfriFix Runtime Module Discovery",
        status:"NOT_FOUND",
        modules:[]
      };
    }

    const modules=fs.readdirSync(this.root,{withFileTypes:true})
      .filter(d=>d.isDirectory())
      .map(d=>d.name)
      .filter(n=>n!=="node_modules");

    modules.forEach(name=>{
      if(!this.registry.resolve(name)){
        this.registry.register(name);
      }
    });

    return {
      component:"AfriFix Runtime Module Discovery",
      status:"DISCOVERED",
      total:modules.length,
      modules,
      registry:this.registry.list(),
      discoveredAt:new Date().toISOString()
    };
  }
}
