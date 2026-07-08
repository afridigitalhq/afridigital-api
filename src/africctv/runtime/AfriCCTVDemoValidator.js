import { bootstrapMockCameras } from "./MockCameraBootstrap.js";
import { bootstrapCameraStreams } from "./CameraStreamBootstrap.js";
import { getMockVisionPayload } from "./MockCameraRuntime.js";
import { observeCameraFeed } from "../intelligence/AfriCCTVObservationEngine.js";
import { cameraWall } from "./wall/MultiCameraWall.js";

export function validateAfriCCTVDemo(){

  const cameras = bootstrapMockCameras();

  const streams = bootstrapCameraStreams();

  const vision = getMockVisionPayload();

  const ai = observeCameraFeed(vision);

  const wall = cameraWall.view();

  const frameValid = Boolean(vision.frameId && vision.heartbeat==="ONLINE");

  const aiValid = ai.type==="afriai.observation";

  const wallValid = wall.length > 0;

  return {
    cameras:cameras.length,
    streams:streams.length,
    wall:wall.length,
    vision:vision.cameras.length,
    ai:ai.observations.length,
    frameValid,
    aiValid,
    wallValid,
    status:
      frameValid && aiValid && wallValid
      ? "DEMO_READY"
      : "FAILED"
  };
}

console.log("🔒 AfriCCTV Demo Validator READY");
