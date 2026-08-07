export class AfriFixGlobalRuntimeRegistry {
  constructor(){ this.registry=new Map([
      ["afridebug",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["afrifix",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["afriai",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["afridesign",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["core",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["platform",{pipeline:"AfriFix Execution Pipeline",status:"READY"}],
      ["africommerce",{pipeline:"AfriFix Execution Pipeline",status:"READY"}]
    ]); try{ const fs=require("fs"); const path=require("path"); const modulesDir=path.resolve("modules"); if(fs.existsSync(modulesDir)){ fs.readdirSync(modulesDir,{withFileTypes:true}).filter(d=>d.isDirectory()).forEach(d=>{ if(!this.registry.has(d.name)){ this.registry.set(d.name,{pipeline:"AfriFix Execution Pipeline",status:"READY"}); } }); } }catch(e){} }

  register(name,config={}){
    this.registry.set(name,{
      pipeline:config.pipeline || "AfriFix Execution Pipeline",
      status:config.status || "READY"
    });

    return {
      component:"AfriFix Global Runtime Registry",
      status:"REGISTERED",
      module:name,
      total:this.registry.size,
      timestamp:new Date().toISOString()
    };
  }

  resolve(name){
    return this.registry.get(name) || null;
  }

  list(){
    return Object.fromEntries(this.registry);
  }
}
