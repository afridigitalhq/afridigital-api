import {
 cameraStreamGateway
} from "./CameraStreamGateway.js";


const session =
cameraStreamGateway.open({
 id:"cam01"
});


const active =
cameraStreamGateway.list();


if(
 !session ||
 session.status!=="LIVE" ||
 session.transport!=="WEBRTC"
){
 throw new Error("STREAM GATEWAY VALIDATION FAILED");
}


if(active.length!==1){
 throw new Error("STREAM SESSION FAILED");
}


console.log("🎥 Camera:",session.cameraId);
console.log("🌐 Transport:",session.transport);
console.log("📡 Status:",session.status);
console.log("🔗 Sessions:",active.length);
console.log("🔒 CAMERA STREAM GATEWAY LOCKED");
