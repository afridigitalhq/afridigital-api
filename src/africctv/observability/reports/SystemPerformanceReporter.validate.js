import {
 systemPerformanceReporter
} from "./SystemPerformanceReporter.js";


const result =
systemPerformanceReporter.generate();


if(result.performance!=="STABLE"){
 throw new Error("REPORTING FAILED");
}


console.log("⏱️ Uptime:",result.uptime);
console.log("⚡ Performance:",result.performance);
console.log("📷 Cameras:",result.cameras);
console.log("🔒 PERFORMANCE REPORTING LOCKED");
