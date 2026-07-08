import {
 threatInvestigationDashboard
} from "./ThreatInvestigationDashboard.js";


threatInvestigationDashboard.add({
 camera:"cam01",
 threat:"UNUSUAL_ACTIVITY"
});


const result =
threatInvestigationDashboard.view();


if(result[0].status!=="OPEN"){
 throw new Error("SOC DASHBOARD FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("🚨 Threat:",result[0].threat);
console.log("📌 Status:",result[0].status);
console.log("🔒 THREAT DASHBOARD LOCKED");
