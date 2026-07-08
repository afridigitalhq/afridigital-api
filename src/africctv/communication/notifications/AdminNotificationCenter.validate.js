import {
 adminNotificationCenter
} from "./AdminNotificationCenter.js";


adminNotificationCenter.notify(
"Camera event detected"
);


const result =
adminNotificationCenter.inbox();


if(result.length!==1){
 throw new Error("NOTIFICATION CENTER FAILED");
}


console.log("📩 Message:",result[0].message);
console.log("👁️ Read:",result[0].read);
console.log("🔒 ADMIN NOTIFICATION CENTER LOCKED");
