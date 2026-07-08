import {
 securityAuditManager
} from "./SecurityAuditManager.js";


securityAuditManager.record({
 action:"camera_access",
 user:"operator01"
});


const result =
securityAuditManager.history();


if(result.length!==1){
 throw new Error("AUDIT FAILED");
}


console.log("📜 Audit Events:",result.length);
console.log("👤 User:",result[0].user);
console.log("🔒 SECURITY AUDIT LOCKED");
