import {
 afriSOCBridge
} from "./AfriSOCBridge.js";


afriSOCBridge.ingest({
 type:"security_alert"
});


const result =
afriSOCBridge.stream();


if(result[0].source!=="AFRICCTV_SOC"){
 throw new Error("SOC BRIDGE FAILED");
}


console.log("🛡️ Source:",result[0].source);
console.log("🚨 Event:",result[0].type);
console.log("🔒 SOC INTEGRATION LOCKED");
