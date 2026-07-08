import {
 adminGovernanceAudit
} from "./AdminGovernanceAudit.js";


adminGovernanceAudit.record({
 action:"FREEZE_USER",
 actor:"ADMIN",
 target:"user-account-001"
});


const result =
adminGovernanceAudit.list();


if(result.length!==1){
 throw new Error("AUDIT FAILED");
}


console.log("📜 Action:",result[0].action);
console.log("👤 Actor:",result[0].actor);
console.log("🔒 GOVERNANCE AUDIT LOCKED");
