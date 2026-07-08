import {
 auditEventIntelligence
} from "./AuditEventIntelligence.js";


auditEventIntelligence.log({
 user:"admin",
 action:"camera_view",
 resource:"cam01"
});


const result =
auditEventIntelligence.history();


if(result.length!==1){
 throw new Error("AUDIT FAILED");
}


console.log("👤 User:",result[0].user);
console.log("⚡ Action:",result[0].action);
console.log("🎥 Resource:",result[0].resource);
console.log("🔒 AUDIT INTELLIGENCE LOCKED");
