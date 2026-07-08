import {
 privacyManagement
} from "./PrivacyManagement.js";


const result =
privacyManagement.verify();


if(result.encryption!=="ENABLED"){
 throw new Error("PRIVACY FAILED");
}


console.log("🔐 Encryption:",result.encryption);
console.log("📊 Tracking:",result.accessTracking);
console.log("🔒 PRIVACY MANAGEMENT LOCKED");
