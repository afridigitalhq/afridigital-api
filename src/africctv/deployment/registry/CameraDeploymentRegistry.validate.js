import {
 cameraDeploymentRegistry
} from "./CameraDeploymentRegistry.js";


cameraDeploymentRegistry.register({
 id:"cam01",
 adapter:"ONVIF",
 tenant:"tenant01"
});


const cameras =
cameraDeploymentRegistry.list();


if(cameras.length!==1){
 throw new Error("CAMERA REGISTRY FAILED");
}


console.log("🎥 Camera:",cameras[0].id);
console.log("🔌 Adapter:",cameras[0].adapter);
console.log("🏢 Tenant:",cameras[0].tenant);
console.log("🔒 CAMERA REGISTRY LOCKED");
