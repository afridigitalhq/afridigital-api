import {
 usageMeter
} from "./UsageMeter.js";


usageMeter.record();
usageMeter.record();


const result =
usageMeter.report();


if(result.status!=="TRACKING"){
 throw new Error("USAGE METER FAILED");
}


console.log("📊 Usage:",result.usage);
console.log("💰 Revenue Tracking:",result.status);
console.log("🔒 USAGE METER LOCKED");
