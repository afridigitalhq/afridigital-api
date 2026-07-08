import {
 ecosystemBridge
} from "./EcosystemBridge.js";


ecosystemBridge.connect("AfriAI");
ecosystemBridge.connect("AfriBank");
ecosystemBridge.connect("AdminOS");


const result =
ecosystemBridge.list();


if(result.length!==3){
 throw new Error("ECOSYSTEM BRIDGE FAILED");
}


console.log("🔗 Products:",result.join(", "));
console.log("🔒 ECOSYSTEM INTEGRATION LOCKED");
