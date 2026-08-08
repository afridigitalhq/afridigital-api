const CoreScanRegistry={
  registry:new Map(),
  register(name,config={}){
    this.registry.set(name,{name,...config,status:config.status||"REGISTERED"});
    return {name,status:"REGISTERED",total:this.registry.size};
  },
  resolve(name){
    return this.registry.get(name)||null;
  },
  list(){
    return Object.fromEntries(this.registry);
  },
  stats(){
    return {total:this.registry.size};
  }
};
export default CoreScanRegistry;
