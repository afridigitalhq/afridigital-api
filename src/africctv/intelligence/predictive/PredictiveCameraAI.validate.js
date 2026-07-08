import {
 predictiveCameraAI
} from "./PredictiveCameraAI.js";


const result =
predictiveCameraAI.predict({
 cameraId:"cam01"
});


if(result.prediction!=="ANOMALY_SCAN_COMPLETE"){
 throw new Error("PREDICTIVE AI FAILED");
}


console.log("🧠 Prediction:",result.prediction);
console.log("📈 Confidence:",result.confidence);
console.log("🔒 PREDICTIVE CAMERA AI LOCKED");
