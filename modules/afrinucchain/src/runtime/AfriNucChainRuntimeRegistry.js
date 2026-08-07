export class AfriNucChainRuntimeRegistry {

  constructor(){
    this.component = "AfriNucChain Runtime Registry";
    this.modules = [];
  }

  register(module){
    this.modules.push(module);

    return {
      component:this.component,
      status:"REGISTERED",
      module,
      totalModules:this.modules.length
    };
  }

  list(){
    return {
      component:this.component,
      status:"ACTIVE",
      modules:this.modules,
      totalModules:this.modules.length
    };
  }
}
