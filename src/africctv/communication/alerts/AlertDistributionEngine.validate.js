import {
 alertDistributionEngine
} from "./AlertDistributionEngine.js";


alertDistributionEngine.send({
 type:"motion_alert",
 camera:"cam01"
});


const result =
alertDistributionEngine.list();


if(result[0]?.status!=="DELIVERED"){
 throw new Error("ALERT ENGINE FAILED");
}


console.log("🚨 Alert:",result[0].type);
console.log("🎥 Camera:",result[0].camera);
console.log("📡 Status:",result[0].status);
console.log("🔒 ALERT DISTRIBUTION LOCKED");
