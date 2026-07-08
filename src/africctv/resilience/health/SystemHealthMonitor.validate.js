import {
 systemHealthMonitor
} from "./SystemHealthMonitor.js";


systemHealthMonitor.register({
 id:"africctv-runtime"
});


const result =
systemHealthMonitor.report();


if(result[0]?.status!=="HEALTHY"){
 throw new Error("HEALTH MONITOR FAILED");
}


console.log("⚡ Service:",result[0].id);
console.log("❤️ Status:",result[0].status);
console.log("🔒 HEALTH MONITOR LOCKED");
