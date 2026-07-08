import {
 complianceReportingEngine
} from "./ComplianceReportingEngine.js";


const result =
complianceReportingEngine.report();


if(result.policies!=="PASS"){
 throw new Error("COMPLIANCE FAILED");
}


console.log("📜 Policies:",result.policies);
console.log("👤 Access:",result.access);
console.log("🔐 Privacy:",result.privacy);
console.log("🔒 COMPLIANCE REPORTING LOCKED");
