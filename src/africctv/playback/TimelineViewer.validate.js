import {
 timelineViewer
} from "./TimelineViewer.js";

timelineViewer.add({
 cameraId:"cam01",
 event:"MOTION",
 timestamp:Date.now()
});

const timeline =
timelineViewer.view();

if(!timeline.length){
 throw new Error("TIMELINE FAILED");
}

console.log("🗂️ Timeline:",timeline.length);
console.log("▶️ Playback Ready");
console.log("🔒 PLAYBACK TIMELINE VIEWER LOCKED");
