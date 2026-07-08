import {
 cameraIdentityManager
} from "./CameraIdentityManager.js";


cameraIdentityManager.register({
 id:"cam01",
 fingerprint:"AFRI-CAM-001"
});


const result =
cameraIdentityManager.get("cam01");


if(result.identity!=="REGISTERED"){
 throw new Error("IDENTITY FAILED");
}


console.log("🆔 Camera:",result.id);
console.log("🔑 Fingerprint:",result.fingerprint);
console.log("🔒 CAMERA IDENTITY LOCKED");
