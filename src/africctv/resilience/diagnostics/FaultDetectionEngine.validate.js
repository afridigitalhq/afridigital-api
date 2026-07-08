import {
 faultDetectionEngine
} from "./FaultDetectionEngine.js";


const result =
faultDetectionEngine.inspect("camera-stream");


if(result.diagnostics!=="CLEAR"){
 throw new Error("DIAGNOSTICS FAILED");
}


console.log("🔍 Component:",result.component);
console.log("🚨 Issue:",result.issue);
console.log("📋 Diagnostics:",result.diagnostics);
console.log("🔒 FAULT DETECTION LOCKED");
