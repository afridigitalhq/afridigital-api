import {
 afriCCTVMonitor
} from "./AfriCCTVMonitor.js";


const metrics =
afriCCTVMonitor.metrics();


if(metrics.status!=="HEALTHY"){
 throw new Error("MONITORING FAILED");
}


console.log("🎥 Cameras:",metrics.cameras);
console.log("📡 Streams:",metrics.streams);
console.log("❤️ Status:",metrics.status);
console.log("🔒 MONITORING LOCKED");
