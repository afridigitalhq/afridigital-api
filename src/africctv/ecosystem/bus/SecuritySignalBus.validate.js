import {
 securitySignalBus
} from "./SecuritySignalBus.js";


securitySignalBus.emit({
 target:"ecosystem",
 type:"security_event"
});


const result =
securitySignalBus.get();


if(result.length!==1){
 throw new Error("SIGNAL BUS FAILED");
}


console.log("🔗 Target:",result[0].target);
console.log("🚨 Signal:",result[0].type);
console.log("🔒 SECURITY SIGNAL BUS LOCKED");
