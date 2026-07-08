import {
 afriAIContextLayer
} from "./AfriAIContextLayer.js";


const result =
afriAIContextLayer.load({
 fleet:"connected",
 incidents:"available"
});


if(result.source!=="AFRICCTV"){
 throw new Error("AI CONTEXT FAILED");
}


console.log("🧠 Source:",result.source);
console.log("📊 Context:",Object.keys(result.context).length);
console.log("🔒 AFRIAI CONTEXT LAYER LOCKED");
