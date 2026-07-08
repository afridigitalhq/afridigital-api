import {
 cameraMarketplace
} from "./CameraMarketplace.js";


cameraMarketplace.register({
 brand:"Generic",
 adapter:"ONVIF"
});


const result =
cameraMarketplace.list();


if(result.length!==1){
 throw new Error("MARKETPLACE FAILED");
}


console.log("📷 Devices:",result.length);
console.log("🔌 Adapter:",result[0].adapter);
console.log("🔒 CAMERA MARKETPLACE LOCKED");
