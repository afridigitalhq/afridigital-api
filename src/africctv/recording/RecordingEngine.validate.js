import {
 recordingEngine
} from "./RecordingEngine.js";

recordingEngine.record(
 "cam01",
 "VIDEO_FRAME"
);

const data =
recordingEngine.list();

if(!data.length){
 throw new Error("RECORDING FAILED");
}

console.log("🎞️ Records:",data.length);
console.log("📹 Event:",data[0].event);
console.log("🔒 RECORDING ENGINE LOCKED");
