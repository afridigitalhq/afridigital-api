import {
 adminOperationsDataProvider
} from "./AdminOperationsDataProvider.js";


const result =
adminOperationsDataProvider.snapshot();


if(result.status!=="LIVE"){
 throw new Error("DASHBOARD PROVIDER FAILED");
}


console.log("🖥️ Status:",result.status);
console.log("📷 Cameras:",result.cameras);
console.log("🚨 Alerts:",result.alerts);
console.log("🔒 ADMIN DATA PROVIDER LOCKED");
