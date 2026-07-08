export class LiveCameraSessionManager {

  constructor(){
    this.sessions = new Map();
  }

  start(camera){
    const session = {
      id:`session-${camera.id}-${Date.now()}`,
      cameraId:camera.id,
      status:"LIVE",
      startedAt:Date.now()
    };

    this.sessions.set(camera.id,session);

    return session;
  }

  stop(cameraId){
    const session=this.sessions.get(cameraId);

    if(!session) return null;

    session.status="STOPPED";

    return session;
  }

  get(cameraId){
    return this.sessions.get(cameraId) || null;
  }

  all(){
    return [...this.sessions.values()];
  }
}

export const liveCameraSessionManager =
new LiveCameraSessionManager();
