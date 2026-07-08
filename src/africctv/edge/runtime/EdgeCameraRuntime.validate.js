import {
 edgeCameraRuntime
} from "./EdgeCameraRuntime.js";


const node =
edgeCameraRuntime.register({
 id:"edge-node-01",
 cameraCount:3
});


if(node.status!=="ONLINE"){
 throw new Error("EDGE RUNTIME FAILED");
}


console.log("⚡ Node:",node.id);
console.log("🎥 Cameras:",node.cameraCount);
console.log("🟢 Status:",node.status);
console.log("🔒 EDGE RUNTIME LOCKED");
