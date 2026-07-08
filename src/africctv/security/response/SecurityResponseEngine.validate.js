import {
 securityResponseEngine
} from "./SecurityResponseEngine.js";


const result =
securityResponseEngine.respond({
 level:"HIGH"
});


if(result.status!=="EXECUTED"){
 throw new Error("SECURITY RESPONSE FAILED");
}


console.log("🚨 Action:",result.action);
console.log("⚡ Status:",result.status);
console.log("🔒 SECURITY RESPONSE LOCKED");
