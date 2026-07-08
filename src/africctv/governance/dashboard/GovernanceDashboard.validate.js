import {
 governanceDashboard
} from "./GovernanceDashboard.js";


const result =
governanceDashboard.status();


if(result.security!=="READY"){
 throw new Error("GOVERNANCE DASHBOARD FAILED");
}


console.log("🛡️ Security:",result.security);
console.log("📊 Compliance:",result.compliance);
console.log("⚠️ Risk:",result.risk);
console.log("🔒 GOVERNANCE DASHBOARD LOCKED");
