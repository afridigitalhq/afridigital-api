import {
 cameraDataAnalyticsEngine
} from "./CameraDataAnalyticsEngine.js";


cameraDataAnalyticsEngine.record({
 camera:"cam01",
 activity:"motion",
 health:"GOOD"
});


const result =
cameraDataAnalyticsEngine.report();


if(result.length!==1){
 throw new Error("ANALYTICS ENGINE FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("📊 Activity:",result[0].activity);
console.log("❤️ Health:",result[0].health);
console.log("🔒 CAMERA ANALYTICS ENGINE LOCKED");
