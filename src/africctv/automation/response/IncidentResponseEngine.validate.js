import {
 incidentResponseEngine
} from "./IncidentResponseEngine.js";


const result =
incidentResponseEngine.respond({
 type:"intrusion",
 cameraId:"cam01",
 severity:"HIGH"
});


if(result.response!=="ESCALATE"){
 throw new Error("INCIDENT RESPONSE FAILED");
}


console.log("🚨 Event:",result.event);
console.log("⚡ Response:",result.response);
console.log("🔒 INCIDENT RESPONSE ENGINE LOCKED");
