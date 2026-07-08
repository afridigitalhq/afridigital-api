export class WebRTCGateway{
  constructor(){
    this.sessions=new Map();
  }

  create(camera){
    const session={
      id:`webrtc-${Date.now()}`,
      cameraId:camera.id,
      transport:"WEBRTC",
      status:"READY"
    };

    this.sessions.set(session.id,session);
    return session;
  }

  list(){
    return [...this.sessions.values()];
  }
}

export const webRTCGateway=new WebRTCGateway();
