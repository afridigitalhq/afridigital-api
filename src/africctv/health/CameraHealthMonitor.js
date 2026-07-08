export class CameraHealthMonitor {
  constructor(){
    this.cameras = new Map();
  }

  register(camera){
    this.cameras.set(camera.id,{
      id: camera.id,
      status:"ONLINE",
      adapter: camera.adapter || "UNKNOWN",
      session:"ACTIVE",
      lastHeartbeat:Date.now()
    });

    return this.cameras.get(camera.id);
  }

  heartbeat(id){
    const camera=this.cameras.get(id);

    if(!camera) return null;

    camera.status="ONLINE";
    camera.lastHeartbeat=Date.now();

    return camera;
  }

  offline(id){
    const camera=this.cameras.get(id);

    if(!camera) return null;

    camera.status="OFFLINE";
    camera.session="DISCONNECTED";

    return camera;
  }

  health(){
    return [...this.cameras.values()];
  }
}

export const cameraHealthMonitor = new CameraHealthMonitor();
