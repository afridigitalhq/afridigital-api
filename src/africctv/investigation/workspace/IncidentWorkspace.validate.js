import {
 incidentWorkspace
} from "./IncidentWorkspace.js";


incidentWorkspace.create({
 id:"INC001",
 camera:"cam01",
 evidence:"evidence001"
});


const result =
incidentWorkspace.list();


if(result[0].status!=="OPEN"){
 throw new Error("INCIDENT FAILED");
}


console.log("🚨 Incident:",result[0].id);
console.log("🎥 Camera:",result[0].camera);
console.log("📁 Evidence:",result[0].evidence);
console.log("🔒 INCIDENT WORKSPACE LOCKED");
