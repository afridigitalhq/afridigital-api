import {
 threatDetectionEngine
} from "./ThreatDetectionEngine.js";


const result =
threatDetectionEngine.analyze({
 cameraId:"cam01",
 type:"intrusion"
});


if(!result.threat){
 throw new Error("THREAT DETECTION FAILED");
}


console.log("🎥 Camera:",result.cameraId);
console.log("🚨 Threat:",result.level);
console.log("🔒 THREAT DETECTION ENGINE LOCKED");
