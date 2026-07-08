import {
 afriAIExecutiveSummary
} from "./AfriAIExecutiveSummary.js";


const result =
afriAIExecutiveSummary.generate({
 online:700,
 offline:200
});


console.log("🧠 Observation:",result.observation);
console.log("👤 Recommendation:",result.recommendation);
console.log("🔒 AFRIAI EXECUTIVE SUMMARY LOCKED");
