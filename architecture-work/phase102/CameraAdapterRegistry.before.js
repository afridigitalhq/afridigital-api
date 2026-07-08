export class CameraAdapterRegistry{
  constructor(){this.adapters=new Map();}
  register(name,adapter){this.adapters.set(name,adapter);}
  get(name){return this.adapters.get(name);}
  list(){return [...this.adapters.keys()];}
}

export class ONVIFAdapter{
  name="ONVIF";
  discover(){return [];}
}

export class RTSPAdapter{
  name="RTSP";
  connect(url){return {protocol:"RTSP",url,status:"READY"};}
}

export class USBAdapter{
  name="USB";
  discover(){return [];}
}

export class WebRTCAdapter{
  name="WEBRTC";
  createSession(camera){return {camera,state:"READY"};}
}

export const adapterRegistry=new CameraAdapterRegistry();

adapterRegistry.register("ONVIF",new ONVIFAdapter());
adapterRegistry.register("RTSP",new RTSPAdapter());
adapterRegistry.register("USB",new USBAdapter());
adapterRegistry.register("WEBRTC",new WebRTCAdapter());

console.log("🔌 Camera Adapter Registry READY");
console.log("📦 Adapters:",adapterRegistry.list().join(", "));
