import {
 edgeCloudSyncBridge
} from "./EdgeCloudSyncBridge.js";


const result =
edgeCloudSyncBridge.sync(
"edge001"
);


if(result.status!=="SYNCED"){
 throw new Error("SYNC FAILED");
}


console.log("⚡ Node:",result.node);
console.log("☁️ Status:",result.status);
console.log("🔒 EDGE CLOUD SYNC LOCKED");
