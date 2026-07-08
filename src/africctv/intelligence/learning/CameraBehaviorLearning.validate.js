import {
 cameraBehaviorLearning
} from "./CameraBehaviorLearning.js";


const result =
cameraBehaviorLearning.learn(
 "cam01",
 "normal_activity"
);


if(!result.trained){
 throw new Error("LEARNING SYSTEM FAILED");
}


console.log("🎥 Camera: cam01");
console.log("🧠 Training:",result.trained);
console.log("📚 Pattern:",result.lastEvent);
console.log("🔒 BEHAVIOR LEARNING LOCKED");
