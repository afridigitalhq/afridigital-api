import {
 securityEventCorrelationEngine
} from "./SecurityEventCorrelationEngine.js";


securityEventCorrelationEngine.ingest({
 camera:"cam01",
 type:"motion_detected",
 severity:"MEDIUM"
});


const result =
securityEventCorrelationEngine.list();


if(result.length!==1){
 throw new Error("CORRELATION FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("🚨 Event:",result[0].type);
console.log("⚠️ Severity:",result[0].severity);
console.log("🔒 SECURITY CORRELATION LOCKED");
