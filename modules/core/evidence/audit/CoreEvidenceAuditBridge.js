import CoreAuditTimeline from "../../audit/CoreAuditTimeline.js";

const CoreEvidenceAuditBridge={record(evidence){
 return CoreAuditTimeline.record({
   type:"EVIDENCE_EVENT",
   evidence,
   timestamp:new Date().toISOString()
 });
}};

export default CoreEvidenceAuditBridge;
