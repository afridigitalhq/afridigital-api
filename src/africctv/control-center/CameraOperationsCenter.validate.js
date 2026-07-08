import {
 cameraOperationsCenter
} from "./CameraOperationsCenter.js";


cameraOperationsCenter.update({
 users:1000,
 online:700,
 offline:200,
 idle:100
});


const result =
cameraOperationsCenter.status();


if(result.users!==1000){
 throw new Error("CONTROL CENTER FAILED");
}


console.log("👥 Users:",result.users);
console.log("🟢 Online:",result.online);
console.log("🟡 Offline:",result.offline);
console.log("⚪ Idle:",result.idle);
console.log("🔒 OPERATIONS CENTER LOCKED");
