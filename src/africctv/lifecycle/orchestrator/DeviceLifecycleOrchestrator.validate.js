import { deviceLifecycleOrchestrator } from "./DeviceLifecycleOrchestrator.js";

const testDevice = {
 id:"camera-test-001",
 model:"AFRICCTV-CAM"
};


const result =
 deviceLifecycleOrchestrator.registerDevice(testDevice);


if(!result || !result.lifecycle){

 throw new Error("DeviceLifecycleOrchestrator failed");

}


console.log("🟢 DeviceLifecycleOrchestrator: OK");
