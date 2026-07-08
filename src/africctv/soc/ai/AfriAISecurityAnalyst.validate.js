import {
 afriAISecurityAnalyst
} from "./AfriAISecurityAnalyst.js";


const result =
afriAISecurityAnalyst.review({
 type:"motion_detected"
});


if(
result.action!=="ADMIN_REVIEW_REQUIRED"
){
 throw new Error("AI SECURITY FAILED");
}


console.log("🧠 Event:",result.event);
console.log("📌 Analysis:",result.analysis);
console.log("👤 Action:",result.action);
console.log("🔒 AFRIAI SECURITY ANALYST LOCKED");
