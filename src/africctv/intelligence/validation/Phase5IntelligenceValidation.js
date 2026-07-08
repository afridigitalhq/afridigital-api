import { motionDetectionPipeline } from "../motion/MotionDetectionPipeline.js";
import { afriAIVisionEventBridge } from "../bridge/AfriAIVisionEventBridge.js";
import { alertEngine } from "../alerts/AlertEngine.js";
import { evidenceTimeline } from "../timeline/EvidenceTimeline.js";

const motion = motionDetectionPipeline.process({
  cameraId:"cam01",
  motion:0.92
});

const aiEvent = afriAIVisionEventBridge.ingest(motion);

const alert = alertEngine.evaluate(motion);

const evidence = evidenceTimeline.record(motion);

const checks = {
  motion: motion.detected,
  aiBridge: aiEvent.target === "afriai",
  alert: !!alert,
  evidence: !!evidence.id
};

console.log("🎥 Motion Pipeline:", checks.motion ? "OK" : "FAIL");
console.log("🧠 AfriAI Bridge:", checks.aiBridge ? "OK" : "FAIL");
console.log("🚨 Alert Engine:", checks.alert ? "OK" : "FAIL");
console.log("🗂️ Evidence Timeline:", checks.evidence ? "OK" : "FAIL");

if(!Object.values(checks).every(Boolean)){
  throw new Error("PHASE 5 VALIDATION FAILED");
}

console.log("================================");
console.log("🟢 AFRICCTV INTELLIGENCE LAYER READY");
console.log("🔒 PHASE 5 LOCKED");
