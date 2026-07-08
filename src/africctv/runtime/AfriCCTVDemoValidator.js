import { bootstrapMockCameras } from "./MockCameraBootstrap.js";
import { bootstrapCameraStreams } from "./CameraStreamBootstrap.js";
import { getMockVisionPayload } from "./MockCameraRuntime.js";
import { observeCameraFeed } from "../intelligence/AfriCCTVObservationEngine.js";
import { cameraWall } from "./wall/MultiCameraWall.js";
import { recordingEngine } from "../recording/RecordingEngine.js";
import { evidenceTimeline } from "../intelligence/timeline/EvidenceTimeline.js";
import { africctvPlaybackBridge } from "../playback/bridge/AfriCCTVPlaybackBridge.js";

export function validateAfriCCTVDemo(){

  const cameras = bootstrapMockCameras();

  const streams = bootstrapCameraStreams();

  const vision = getMockVisionPayload();

  const ai = observeCameraFeed(vision);

  const wall = cameraWall.view();

  const recording =
    recordingEngine.record(
      `cam${vision.active}`,
      "VALIDATION_FRAME"
    );

  const evidence =
    evidenceTimeline.record({
      cameraId:`cam${vision.active}`,
      type:"VALIDATION_EVENT",
      timestamp:Date.now()
    });

  const playback =
    africctvPlaybackBridge.requestFromEvidence(evidence);

  const frameValid = Boolean(vision.frameId && vision.heartbeat==="ONLINE");

  const aiValid = ai.type==="afriai.observation";

  const wallValid = wall.length > 0;

  const recordingValid =
    Boolean(recording.cameraId);

  const evidenceValid =
    Boolean(evidence.id);

  const playbackValid =
    playback.status==="REQUESTED";

  return {
    cameras:cameras.length,
    streams:streams.length,
    wall:wall.length,
    vision:vision.cameras.length,
    ai:ai.observations.length,
    frameValid,
    aiValid,
    wallValid,
    recordingValid,
    evidenceValid,
    playbackValid,
    status:
      frameValid && aiValid && wallValid && recordingValid && evidenceValid && playbackValid
      ? "DEMO_READY"
      : "FAILED"
  };
}

console.log("🔒 AfriCCTV Demo Validator READY");
