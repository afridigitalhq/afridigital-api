import {
 recoveryEngine
} from "./RecoveryEngine.js";


const backup =
recoveryEngine.backup({
 camera:"cam01",
 evidence:"stored"
});


if(!backup.created){
 throw new Error("RECOVERY FAILED");
}


console.log("💾 Backup:",backup.created);
console.log("📦 Records:",backup.size);
console.log("🔒 DISASTER RECOVERY LOCKED");
