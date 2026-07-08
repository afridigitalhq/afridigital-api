export class RTSPAdapter{
  constructor(){
    this.sessions=new Map();
  }

  connect(camera){
    const session={
      id:`rtsp-${camera.id}-${Date.now()}`,
      cameraId:camera.id,
      url:camera.url || null,
      status:"CONNECTED"
    };

    this.sessions.set(session.id,session);
    return session;
  }

  disconnect(id){
    return this.sessions.delete(id);
  }

  list(){
    return [...this.sessions.values()];
  }
}

export const rtspAdapter=new RTSPAdapter();
