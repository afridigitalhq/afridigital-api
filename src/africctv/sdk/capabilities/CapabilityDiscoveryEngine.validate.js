import {
 capabilityDiscoveryEngine
} from "./CapabilityDiscoveryEngine.js";


const result =
capabilityDiscoveryEngine.inspect({
 id:"sample-camera-plugin",
 capabilities:[
  "STREAM",
  "AI"
 ]
});


if(result.capabilities.length!==2){
 throw new Error("CAPABILITY FAILED");
}


console.log("🧩 Plugin:",result.plugin);
console.log("⚡ Features:",result.capabilities.join(","));
console.log("🔒 CAPABILITY DISCOVERY LOCKED");
