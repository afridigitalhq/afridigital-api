import {
 cameraCommandQueue
} from "./CameraCommandQueue.js";


cameraCommandQueue.push({
 cameraId:"cam01",
 action:"STOP_STREAM",
 source:"ADMIN"
});


const result =
cameraCommandQueue.process();


if(result[0].status!=="EXECUTED"){
 throw new Error("COMMAND QUEUE FAILED");
}


console.log("🎥 Camera:",result[0].cameraId);
console.log("⚡ Action:",result[0].action);
console.log("👤 Source:",result[0].source);
console.log("🔒 COMMAND QUEUE LOCKED");
