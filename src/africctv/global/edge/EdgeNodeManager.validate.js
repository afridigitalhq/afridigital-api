import {
 edgeNodeManager
} from "./EdgeNodeManager.js";


edgeNodeManager.register({
 id:"edge01",
 location:"IBADAN"
});


const result =
edgeNodeManager.list();


if(result[0].status!=="ONLINE"){
 throw new Error("EDGE NODE FAILED");
}


console.log("⚡ Edge:",result[0].id);
console.log("📍 Location:",result[0].location);
console.log("🔒 EDGE COMPUTING LOCKED");
