import {
 recoveryCoordinator
} from "./RecoveryCoordinator.js";


const result =
recoveryCoordinator.status();


if(result.backup!=="READY"){
 throw new Error("RECOVERY FAILED");
}


console.log("💾 Backup:",result.backup);
console.log("📋 Plan:",result.recoveryPlan);
console.log("🔒 RECOVERY COORDINATION LOCKED");
