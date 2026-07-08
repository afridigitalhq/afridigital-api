import {
 policyEnforcementEngine
} from "./PolicyEnforcementEngine.js";


policyEnforcementEngine.register({
 id:"camera-access-policy",
 status:"APPROVED"
});


const result =
policyEnforcementEngine.check(
"camera-access-policy"
);


if(result.status!=="APPROVED"){
 throw new Error("POLICY FAILED");
}


console.log("📜 Policy:",result.id);
console.log("✅ Status:",result.status);
console.log("🔒 POLICY ENGINE LOCKED");
