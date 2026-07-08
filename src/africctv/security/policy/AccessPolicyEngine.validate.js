import {
 accessPolicyEngine
} from "./AccessPolicyEngine.js";


const result =
accessPolicyEngine.check(
"ADMIN",
"EXPORT_EVIDENCE"
);


if(!result.allowed){
 throw new Error("ACCESS POLICY FAILED");
}


console.log("👤 Role:",result.role);
console.log("⚡ Action:",result.action);
console.log("🔒 ACCESS POLICY ENGINE LOCKED");
