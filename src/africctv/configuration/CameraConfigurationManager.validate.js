import {
 cameraConfigurationManager
} from "./CameraConfigurationManager.js";


cameraConfigurationManager.save(
"cam01",
{
 resolution:"1080p",
 recording:"ENABLED",
 ai:"ENABLED"
}
);


const result =
cameraConfigurationManager.load("cam01");


if(result.ai!=="ENABLED"){
 throw new Error("CONFIG FAILED");
}


console.log("⚙️ Resolution:",result.resolution);
console.log("🎥 Recording:",result.recording);
console.log("🧠 AI:",result.ai);
console.log("🔒 CONFIGURATION LOCKED");
