import {
 auditTrail
} from "./AuditTrail.js";


auditTrail.record({
 actor:"admin",
 action:"camera_access",
 cameraId:"cam01"
});


const history =
auditTrail.history();


if(history.length!==1){
 throw new Error("AUDIT TRAIL FAILED");
}


console.log("📜 Audit:",history.length);
console.log("👤 Actor:",history[0].actor);
console.log("🎥 Camera:",history[0].cameraId);
console.log("🔒 AUDIT TRAILS LOCKED");
