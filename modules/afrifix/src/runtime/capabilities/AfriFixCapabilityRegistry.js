import fs from "fs";
import path from "path";

export class AfriFixCapabilityRegistry {
  constructor(root="modules"){
    this.capabilities=new Map();
    const modulesDir=path.resolve(root);

    if(fs.existsSync(modulesDir)){
      fs.readdirSync(modulesDir,{withFileTypes:true})
        .filter(d=>d.isDirectory())
        .forEach(d=>{
          this.capabilities.set(d.name,["verify"]);
        });
    }

    this.capabilities.set("afriai",["repair","verify"]);
    this.capabilities.set("afridebug",["repair","verify","certify"]);
    this.capabilities.set("afrifix",["repair","verify","certify"]);
    this.capabilities.set("platform",["certify"]);
  }

  register(module,actions=[]){
    this.capabilities.set(module,actions);
    return this;
  }

  supports(module,action){
    return (this.capabilities.get(module)||[]).includes(action);
  }

  list(){
    return Object.fromEntries(this.capabilities);
  }
}
