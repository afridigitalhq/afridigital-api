import {
 evidenceTimelineIntelligence
} from "./EvidenceTimelineIntelligence.js";


evidenceTimelineIntelligence.add({
 camera:"cam01",
 event:"motion_detected",
 evidence:"evidence001"
});


const result =
evidenceTimelineIntelligence.list();


if(result.length!==1){
 throw new Error("TIMELINE FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("🚨 Event:",result[0].event);
console.log("📁 Evidence:",result[0].evidence);
console.log("🔒 EVIDENCE TIMELINE LOCKED");
