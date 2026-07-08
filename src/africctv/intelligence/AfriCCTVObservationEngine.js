export function observeCameraFeed(payload){

  const cameras = payload.cameras || [];

  return {
    type:"afriai.observation",
    source:"AfriCCTV",
    observations:cameras.map(camera=>({
      cameraId:camera.id,
      status:camera.status || "UNKNOWN",
      motion:camera.motion || 0,
      recommendation:
        camera.motion > 0.7
        ? "HIGH_ACTIVITY"
        : "NORMAL"
    })),
    ts:Date.now()
  };
}

console.log("🤖 AfriCCTV Observation Engine READY");
