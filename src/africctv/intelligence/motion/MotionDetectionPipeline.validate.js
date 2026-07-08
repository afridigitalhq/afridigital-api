import { motionDetectionPipeline } from "./MotionDetectionPipeline.js";

const event = motionDetectionPipeline.process({
  cameraId:"cam01",
  motion:0.85
});

if(!event.detected){
  throw new Error("Motion detection failed");
}

console.log("🎥 Camera:", event.cameraId);
console.log("🚨 Motion:", event.detected);
console.log("📊 Confidence:", event.confidence);
console.log("✅ MOTION DETECTION PIPELINE LOCKED");
