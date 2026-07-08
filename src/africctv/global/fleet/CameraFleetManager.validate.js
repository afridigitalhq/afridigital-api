import {
 cameraFleetManager
} from "./CameraFleetManager.js";


cameraFleetManager.register({
 id:"cam-global-01",
 region:"AFRICA"
});


const result =
cameraFleetManager.list();


if(result.length!==1){
 throw new Error("GLOBAL FLEET FAILED");
}


console.log("🌍 Region:",result[0].region);
console.log("🎥 Cameras:",result.length);
console.log("🔒 GLOBAL FLEET MANAGEMENT LOCKED");
