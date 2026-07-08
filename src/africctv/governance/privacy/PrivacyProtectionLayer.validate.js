import {
 privacyProtectionLayer
} from "./PrivacyProtectionLayer.js";


const result =
privacyProtectionLayer.check(
 "EVIDENCE_RETENTION"
);


if(result.status!=="PROTECTED"){
 throw new Error("PRIVACY FAILED");
}


console.log("🛡️ Policy:",result.policy);
console.log("🔐 Status:",result.status);
console.log("🔒 PRIVACY LAYER LOCKED");
