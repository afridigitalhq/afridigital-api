import {
 cameraPluginSDK
} from "./CameraPluginSDK.js";


cameraPluginSDK.register({
 id:"sample-camera-plugin",
 vendor:"AfriDigital",
 capabilities:[
  "STREAM",
  "EVENTS"
 ]
});


const result =
cameraPluginSDK.get(
"sample-camera-plugin"
);


if(!result){
 throw new Error("PLUGIN SDK FAILED");
}


console.log("🔌 Plugin:",result.id);
console.log("🏢 Vendor:",result.vendor);
console.log("⚡ Capabilities:",result.capabilities.join(","));
console.log("🔒 CAMERA PLUGIN SDK LOCKED");
