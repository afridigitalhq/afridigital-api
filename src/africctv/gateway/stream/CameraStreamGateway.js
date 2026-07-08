const sessions = new Map();

export class CameraStreamGateway {

  open(camera){

    const session = {
      id:`stream-${camera.id}-${Date.now()}`,
      cameraId:camera.id,
      transport:"WEBRTC",
      status:"LIVE",
      startedAt:Date.now()
    };

    sessions.set(session.id,session);

    return session;
  }


  close(sessionId){

    return sessions.delete(sessionId);

  }


  get(sessionId){

    return sessions.get(sessionId) || null;

  }


  list(){

    return [...sessions.values()];

  }

}

export const cameraStreamGateway =
new CameraStreamGateway();
