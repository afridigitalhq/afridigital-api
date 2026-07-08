import {
 videoEventStore
} from "./VideoEventStore.js";


videoEventStore.save({
 type:"motion_detected",
 camera:"cam01"
});


const result =
videoEventStore.all();


if(result.length!==1){
 throw new Error("EVENT STORE FAILED");
}


console.log("🚨 Event:",result[0].type);
console.log("🎥 Camera:",result[0].camera);
console.log("🔒 VIDEO EVENT STORE LOCKED");
