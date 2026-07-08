import {
 cameraCommandCenter
} from "./CameraCommandCenter.js";


const result =
cameraCommandCenter.overview({
 total:1000,
 online:700,
 offline:200,
 idle:100
});


console.log("🎥 Total:",result.total);
console.log("🟢 Online:",result.online);
console.log("🟡 Offline:",result.offline);
console.log("⚪ Idle:",result.idle);
console.log("🔒 COMMAND CENTER LOCKED");
