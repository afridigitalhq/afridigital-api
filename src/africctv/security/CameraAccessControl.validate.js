import {
 cameraAccessControl
} from "./CameraAccessControl.js";

cameraAccessControl.grant(
 "admin",
 "cam01"
);

const allowed =
cameraAccessControl.check(
 "admin",
 "cam01"
);

if(!allowed){
 throw new Error("ACCESS CONTROL FAILED");
}

console.log("🔐 Permission:",allowed);
console.log("🔒 CAMERA ACCESS CONTROL LOCKED");
