import {
 analyticsDashboardEngine
} from "./AnalyticsDashboardEngine.js";


const result =
analyticsDashboardEngine.snapshot();


if(result.status!=="LIVE"){
 throw new Error("DASHBOARD ENGINE FAILED");
}


console.log("🎥 Cameras:",result.cameras);
console.log("📡 Status:",result.status);
console.log("🧠 Intelligence:",result.intelligence);
console.log("🔒 ANALYTICS DASHBOARD LOCKED");
