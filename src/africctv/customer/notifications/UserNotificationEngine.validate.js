import {
 userNotificationEngine
} from "./UserNotificationEngine.js";


const result =
userNotificationEngine.create({
 user:"user001",
 message:"Evidence available"
});


if(result.status!=="READY"){
 throw new Error("NOTIFICATION FAILED");
}


console.log("👤 User:",result.user);
console.log("📩 Message:",result.message);
console.log("🔒 NOTIFICATION INTELLIGENCE LOCKED");
