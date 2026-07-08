import {
 liveCameraSessionManager
} from "./LiveCameraSessionManager.js";

liveCameraSessionManager.start({
 id:"cam01"
});

const sessions =
liveCameraSessionManager.all();

if(sessions[0]?.status!=="LIVE"){
 throw new Error("SESSION MANAGER FAILED");
}

console.log("🎥 Sessions:",sessions.length);
console.log("📡 Status:",sessions[0].status);
console.log("🔒 LIVE CAMERA SESSION MANAGER LOCKED");
