import {
 edgeCloudSyncBridge
} from "./EdgeCloudSyncBridge.js";


const result =
edgeCloudSyncBridge.sync({
 camera:"cam01"
});


if(result.status!=="SYNCED"){
 throw new Error("SYNC FAILED");
}


console.log("📡 Source:",result.source);
console.log("☁️ Destination:",result.destination);
console.log("✅ Status:",result.status);
console.log("🔒 EDGE CLOUD SYNC LOCKED");
