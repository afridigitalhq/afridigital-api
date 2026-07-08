import {
 edgeEventProcessingPipeline
} from "./EdgeEventProcessingPipeline.js";


edgeEventProcessingPipeline.process({
 camera:"cam01",
 event:"motion_detected"
});


const result =
edgeEventProcessingPipeline.list();


if(!result[0].processed){
 throw new Error("EDGE EVENT FAILED");
}


console.log("🎥 Camera:",result[0].camera);
console.log("📡 Event:",result[0].event);
console.log("⚡ Processed:",result[0].processed);
console.log("🔒 EDGE EVENT PIPELINE LOCKED");
