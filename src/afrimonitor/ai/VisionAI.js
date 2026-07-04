import { afriMonitorBus } from "../events/AfriMonitorBus.js";

export class VisionAI {
  constructor() {
    afriMonitorBus.on("frame", (data) => this.analyze(data));
  }

  analyze(frame) {
    const alert = frame.motion && Math.random() > 0.8;

    if (alert) {
      afriMonitorBus.emit("alert", {
        cameraId: frame.cameraId,
        severity: "MOTION_DETECTED",
        timestamp: frame.timestamp
      });
    }
  }
}
