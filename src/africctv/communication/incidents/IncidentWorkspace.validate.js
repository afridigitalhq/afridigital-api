import {
 incidentWorkspace
} from "./IncidentWorkspace.js";


incidentWorkspace.create({
 title:"Camera motion event",
 camera:"cam01"
});


const result =
incidentWorkspace.list();


if(result[0]?.state!=="OPEN"){
 throw new Error("INCIDENT WORKSPACE FAILED");
}


console.log("🚨 Incident:",result[0].title);
console.log("🎥 Camera:",result[0].camera);
console.log("📂 State:",result[0].state);
console.log("🔒 INCIDENT WORKSPACE LOCKED");
