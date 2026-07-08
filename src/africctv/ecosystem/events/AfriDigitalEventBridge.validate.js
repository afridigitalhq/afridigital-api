import {
 afriDigitalEventBridge
} from "./AfriDigitalEventBridge.js";


afriDigitalEventBridge.publish({
 type:"camera_alert"
});


const result =
afriDigitalEventBridge.stream();


if(result[0].source!=="africctv"){
 throw new Error("EVENT BRIDGE FAILED");
}


console.log("🌍 Source:",result[0].source);
console.log("⚡ Event:",result[0].type);
console.log("🔒 CORE EVENT INTEGRATION LOCKED");
