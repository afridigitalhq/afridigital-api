import {
 evidenceArchiveGovernance
} from "./EvidenceArchiveGovernance.js";


const result =
evidenceArchiveGovernance.register({
 evidence:"evidence001",
 retention:"STANDARD"
});


if(result.archive!=="CONTROLLED"){
 throw new Error("ARCHIVE FAILED");
}


console.log("📁 Evidence:",result.evidence);
console.log("🗄️ Archive:",result.archive);
console.log("🔒 ARCHIVE GOVERNANCE LOCKED");
