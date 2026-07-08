import {
 afriAIEvidenceAssistant
} from "./AfriAIEvidenceAssistant.js";


const result =
afriAIEvidenceAssistant.analyze(
"evidence001"
);


if(
result.recommendation!=="ADMIN_REVIEW_REQUIRED"
){
 throw new Error("AI EVIDENCE FAILED");
}


console.log("🧠 Evidence:",result.evidence);
console.log("📌 Summary:",result.summary);
console.log("👤 Action:",result.recommendation);
console.log("🔒 AFRIAI EVIDENCE ASSISTANT LOCKED");
