import {
 cameraAuth
} from "./CameraAuth.js";


cameraAuth.register({
 id:"cam01",
 token:"secure-camera-token"
});


const result =
cameraAuth.authenticate(
 "cam01",
 "secure-camera-token"
);


const status =
cameraAuth.status("cam01");


if(
 !result ||
 !status.authenticated
){
 throw new Error("CAMERA AUTH FAILED");
}


console.log("🎥 Camera:",status.id);
console.log("🔐 Authenticated:",status.authenticated);
console.log("🔒 CAMERA AUTHENTICATION LOCKED");
