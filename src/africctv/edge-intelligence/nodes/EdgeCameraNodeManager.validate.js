import {
 edgeCameraNodeManager
} from "./EdgeCameraNodeManager.js";


edgeCameraNodeManager.register({
 id:"edge001",
 cameras:50,
 state:"ONLINE"
});


const result =
edgeCameraNodeManager.list();


if(result[0].state!=="ONLINE"){
 throw new Error("EDGE NODE FAILED");
}


console.log("⚡ Node:",result[0].id);
console.log("🎥 Cameras:",result[0].cameras);
console.log("🟢 State:",result[0].state);
console.log("🔒 EDGE NODE MANAGER LOCKED");
