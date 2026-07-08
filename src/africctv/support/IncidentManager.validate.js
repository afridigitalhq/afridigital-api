import {
 incidentManager
} from "./IncidentManager.js";


incidentManager.create(
 "camera_disconnect"
);


const result =
incidentManager.list();


if(result.length!==1){
 throw new Error("INCIDENT SYSTEM FAILED");
}


console.log("🚨 Incidents:",result.length);
console.log("📌 Status:",result[0].status);
console.log("🔒 INCIDENT MANAGEMENT LOCKED");
