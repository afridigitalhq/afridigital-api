import {
 visionIntelligence
} from "./VisionIntelligence.js";


const result =
visionIntelligence.analyze({
 type:"motion"
});


if(result.analysis!=="READY"){
 throw new Error("AI VISION FAILED");
}


console.log("🧠 Source:",result.source);
console.log("👁️ Analysis:",result.analysis);
console.log("🔒 ADVANCED AI VISION LOCKED");
