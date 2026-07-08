import {
 operationsMetricsCollector
} from "./OperationsMetricsCollector.js";


operationsMetricsCollector.record({
 cameraCount:3,
 sessions:1,
 events:5
});


const result =
operationsMetricsCollector.report();


if(result.length!==1){
 throw new Error("METRICS FAILED");
}


console.log("📷 Cameras:",result[0].cameraCount);
console.log("🔗 Sessions:",result[0].sessions);
console.log("⚡ Events:",result[0].events);
console.log("🔒 METRICS COLLECTOR LOCKED");
