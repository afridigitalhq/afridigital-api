import { alertEngine } from "./AlertEngine.js";

const alert = alertEngine.evaluate({
  detected:true,
  type:"MOTION",
  cameraId:"cam01"
});

if(!alert){
 throw new Error("Alert engine failed");
}

console.log("🚨 Alert:",alert.type);
console.log("📷 Camera:",alert.cameraId);
console.log("⚠️ Level:",alert.level);
console.log("✅ ALERT ENGINE LOCKED");
