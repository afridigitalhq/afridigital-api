import { afriAIVisionEventBridge } from "./AfriAIVisionEventBridge.js";

const event = afriAIVisionEventBridge.ingest({
  type:"MOTION",
  cameraId:"cam01",
  timestamp:Date.now()
});

if(event.target !== "afriai"){
 throw new Error("AfriAI bridge failed");
}

console.log("🧠 Source:",event.source);
console.log("🤖 Target:",event.target);
console.log("🎥 Camera:",event.cameraId);
console.log("✅ AFRIAI VISION EVENT BRIDGE LOCKED");
