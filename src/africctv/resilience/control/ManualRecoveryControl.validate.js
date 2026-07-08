import {
 manualRecoveryControl
} from "./ManualRecoveryControl.js";


manualRecoveryControl.request(
"restart-camera-session"
);


const result =
manualRecoveryControl.list();


if(result[0]?.approval!=="REQUIRED"){
 throw new Error("RECOVERY CONTROL FAILED");
}


console.log("🛠️ Action:",result[0].action);
console.log("👤 Approval:",result[0].approval);
console.log("🔒 MANUAL RECOVERY CONTROL LOCKED");
