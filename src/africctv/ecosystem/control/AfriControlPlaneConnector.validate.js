import {
 afriControlPlaneConnector
} from "./AfriControlPlaneConnector.js";


const result =
afriControlPlaneConnector.connect();


if(!result.connected){
 throw new Error("CONTROL PLANE FAILED");
}


console.log("🖥️ System:",result.system);
console.log("🔗 Connected:",result.connected);
console.log("🔒 CONTROL PLANE CONNECTION LOCKED");
