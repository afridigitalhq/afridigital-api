import { evidenceTimeline } from "./EvidenceTimeline.js";

const evidence = evidenceTimeline.record({
  cameraId:"cam01",
  type:"MOTION",
  timestamp:Date.now()
});

if(!evidence.id){
 throw new Error("Evidence timeline failed");
}

console.log("🗂️ Evidence:",evidence.id);
console.log("📷 Camera:",evidence.cameraId);
console.log("📌 Type:",evidence.type);
console.log("✅ EVIDENCE TIMELINE LOCKED");
