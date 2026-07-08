import {
 securityResponseCommand
} from "./SecurityResponseCommand.js";


securityResponseCommand.execute({
 action:"ESCALATE_INCIDENT",
 target:"cam01"
});


const result =
securityResponseCommand.history();


if(result[0].actor!=="ADMIN"){
 throw new Error("RESPONSE COMMAND FAILED");
}


console.log("⚡ Action:",result[0].action);
console.log("🎥 Target:",result[0].target);
console.log("👤 Actor:",result[0].actor);
console.log("🔒 SECURITY RESPONSE LOCKED");
