import {
 predictiveAnalyticsEngine
} from "./PredictiveAnalyticsEngine.js";


const result =
predictiveAnalyticsEngine.predict({
 camera:"cam01"
});


if(result.prediction!=="STABLE"){
 throw new Error("PREDICTIVE ANALYTICS FAILED");
}


console.log("🎥 Camera:",result.source.camera);
console.log("🔮 Prediction:",result.prediction);
console.log("🔒 PREDICTIVE ANALYTICS LOCKED");
