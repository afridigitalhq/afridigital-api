import {
 communicationGateway
} from "./CommunicationGateway.js";


const result =
communicationGateway.route(
"dashboard",
"Security update"
);


if(result.status!=="QUEUED"){
 throw new Error("COMMUNICATION GATEWAY FAILED");
}


console.log("📡 Channel:",result.channel);
console.log("💬 Message:",result.message);
console.log("📦 Status:",result.status);
console.log("🔒 COMMUNICATION GATEWAY LOCKED");
