import {
 afriCCTVEventPipeline
} from "./AfriCCTVEventPipeline.js";

let received=null;

afriCCTVEventPipeline.subscribe(
 event=>{
  received=event;
 }
);

const heartbeat =
afriCCTVEventPipeline.broadcast({
 type:"camera:heartbeat",
 cameraId:"cam01",
 status:"ONLINE"
});

if(!received){
 throw new Error("EVENT PIPELINE FAILED");
}

if(
 heartbeat.type!=="camera:heartbeat" ||
 heartbeat.status!=="ONLINE"
){
 throw new Error("HEARTBEAT VALIDATION FAILED");
}

console.log("📡 Event:",received.type);
console.log("🎥 Camera:",received.cameraId);
console.log("❤️ Status:",received.status);
console.log("🔒 WEBSOCKET CAMERA EVENT PIPELINE LOCKED");
