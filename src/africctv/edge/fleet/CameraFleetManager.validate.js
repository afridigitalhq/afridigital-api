import {
 cameraFleetManager
} from "./CameraFleetManager.js";


cameraFleetManager.add({
 id:"enterprise-fleet-01",
 sites:5
});


const fleet =
cameraFleetManager.all();


if(fleet.length!==1){
 throw new Error("FLEET FAILED");
}


console.log("🏢 Fleet:",fleet[0].id);
console.log("📍 Sites:",fleet[0].sites);
console.log("🔒 FLEET MANAGER LOCKED");
