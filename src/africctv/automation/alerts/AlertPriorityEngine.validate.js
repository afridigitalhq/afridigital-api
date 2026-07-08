import {
 alertPriorityEngine
} from "./AlertPriorityEngine.js";


const result =
alertPriorityEngine.prioritize({
 type:"intrusion",
 severity:"HIGH"
});


if(result.priority!=="CRITICAL"){
 throw new Error("ALERT PRIORITY FAILED");
}


console.log("🚨 Alert:",result.type);
console.log("📊 Priority:",result.priority);
console.log("🔒 ALERT PRIORITY LOCKED");
