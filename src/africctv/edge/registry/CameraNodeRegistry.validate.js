import {
 cameraNodeRegistry
} from "./CameraNodeRegistry.js";


cameraNodeRegistry.add({
 id:"site-lagos-01",
 region:"NG"
});


const result =
cameraNodeRegistry.list();


if(result.length!==1){
 throw new Error("NODE REGISTRY FAILED");
}


console.log("🌍 Site:",result[0].id);
console.log("📍 Region:",result[0].region);
console.log("🔒 NODE REGISTRY LOCKED");
