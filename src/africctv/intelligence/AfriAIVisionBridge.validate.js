import {
 afriAIVisionBridge
} from "./AfriAIVisionBridge.js";


const result =
afriAIVisionBridge.ingest({
 type:"motion_detected",
 cameraId:"cam01"
});


if(
 result.ai!=="ready" ||
 result.source!=="africctv"
){
 throw new Error("AI BRIDGE FAILED");
}


console.log("🧠 AI:",result.ai);
console.log("🎥 Camera:",result.event.cameraId);
console.log("🚨 Event:",result.event.type);
console.log("🔒 AFRIAI SECURITY HOOK LOCKED");
