import {
 supportTicketManager
} from "./SupportTicketManager.js";


supportTicketManager.create({
 user:"user001",
 issue:"camera_offline"
});


const result =
supportTicketManager.list();


if(result[0].status!=="OPEN"){
 throw new Error("SUPPORT FAILED");
}


console.log("🎫 Issue:",result[0].issue);
console.log("📌 Status:",result[0].status);
console.log("🔒 SUPPORT INTELLIGENCE LOCKED");
