import {
 adminKillSwitch
} from "./AdminKillSwitch.js";


adminKillSwitch.freeze(
"user-account-001"
);


const result =
adminKillSwitch.status(
"user-account-001"
);


if(result.state!=="FROZEN"){
 throw new Error("KILLSWITCH FAILED");
}


console.log("🛡️ Target: user-account-001");
console.log("🚫 State:",result.state);
console.log("📜 Reason:",result.reason);
console.log("🔒 ADMIN KILLSWITCH LOCKED");
