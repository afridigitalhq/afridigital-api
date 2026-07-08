export class CameraEngine{
  constructor(){
    this.registry=new Map();
    this.sessions=new Map();
  }

  register(camera){
    this.registry.set(camera.id,{
      health:"ONLINE",
      status:"READY",
      ...camera
    });
  }

  unregister(id){
    this.registry.delete(id);
    this.sessions.delete(id);
  }

  start(id){
    const cam=this.registry.get(id);
    if(!cam) return false;
    this.sessions.set(id,{
      cameraId:id,
      startedAt:Date.now(),
      state:"LIVE"
    });
    return true;
  }

  stop(id){
    this.sessions.delete(id);
  }

  health(){
    return [...this.registry.values()].map(c=>({
      id:c.id,
      name:c.name,
      status:c.status,
      health:c.health,
      live:this.sessions.has(c.id)
    }));
  }
}

export const cameraEngine=new CameraEngine();

cameraEngine.register({id:"cam01",name:"Front Gate",adapter:"DEV"});
cameraEngine.register({id:"cam02",name:"Reception",adapter:"DEV"});
cameraEngine.register({id:"cam03",name:"Warehouse",adapter:"DEV"});

cameraEngine.start("cam01");
cameraEngine.start("cam02");
cameraEngine.start("cam03");

console.log("📷 Camera Engine READY:",cameraEngine.health().length,"cameras");
