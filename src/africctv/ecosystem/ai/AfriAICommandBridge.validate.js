import {
 afriAICommandBridge
} from "./AfriAICommandBridge.js";


const result =
afriAICommandBridge.analyze({
 type:"motion_detected"
});


if(result.aiStatus!=="READY"){
 throw new Error("AI BRIDGE FAILED");
}


console.log("🧠 AI:",result.aiStatus);
console.log("🎥 Module:",result.module);
console.log("🔒 AFRIAI COMMAND BRIDGE LOCKED");
