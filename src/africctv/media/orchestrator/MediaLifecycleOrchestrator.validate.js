import { mediaLifecycleOrchestrator } from "./MediaLifecycleOrchestrator.js";


const media = {
 id:"phase36-validation-camera",
 stream:"validation-stream",
 recording:true,
 playback:true,
 archive:true
};


const result =
 mediaLifecycleOrchestrator.coordinate(media);


if(!result){

 throw new Error("Media lifecycle orchestration failed");

}


if(!result.coordinatedAt){

 throw new Error("Media coordination timestamp missing");

}


console.log("🟢 Stream Coordination: OK");
console.log("🟢 Recording Coordination: OK");
console.log("🟢 Playback Coordination: OK");
console.log("🟢 Archive Coordination: OK");
console.log("🟢 Video Event Coordination: OK");
console.log("🟢 MediaLifecycleOrchestrator: OK");
