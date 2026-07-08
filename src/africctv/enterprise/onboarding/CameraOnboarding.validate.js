import {
 cameraOnboarding
} from "./CameraOnboarding.js";


cameraOnboarding.onboard({
 id:"customer01",
 cameras:["cam01","cam02"]
});


const result =
cameraOnboarding.list();


if(result.length!==1){
 throw new Error("CUSTOMER ONBOARDING FAILED");
}


console.log("👤 Customer:",result[0].id);
console.log("🎥 Cameras:",result[0].cameras.length);
console.log("🔒 CUSTOMER CAMERA ONBOARDING LOCKED");
