export class AfriProductRegistry {
  constructor(){
    this.products=new Map();
  }

  register(name, initFn){
    this.products.set(name, initFn);
    console.log("🧩 Registered product:", name);
  }

  initAll(server){
    for(const [name,initFn] of this.products){
      try{
        initFn(server);
        console.log("🚀 Initialized:", name);
      }catch(e){
        console.log("❌ Failed:", name,e.message);
      }
    }
  }
}
