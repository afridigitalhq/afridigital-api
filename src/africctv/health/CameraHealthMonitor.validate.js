import { cameraHealthMonitor } from "./CameraHealthMonitor.js";

cameraHealthMonitor.register({
  id:"cam01",
  adapter:"ONVIF"
});

cameraHealthMonitor.heartbeat("cam01");

const result = cameraHealthMonitor.health();

if(result[0]?.status !== "ONLINE"){
  throw new Error("Camera health validation failed");
}

console.log("📡 Camera Health:", result.length, "camera");
console.log("❤️ Heartbeat:", result[0].status);
console.log("🔌 Adapter:", result[0].adapter);
console.log("🎥 Session:", result[0].session);
console.log("✅ CAMERA HEALTH MONITOR LOCKED");
