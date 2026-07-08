import {
 ecosystemAccessGovernance
} from "./EcosystemAccessGovernance.js";


const result =
ecosystemAccessGovernance.verify(
"AfriAI"
);


if(result.permission!=="GRANTED"){
 throw new Error("GOVERNANCE FAILED");
}


console.log("🧩 Module:",result.module);
console.log("🔐 Permission:",result.permission);
console.log("🔒 ECOSYSTEM GOVERNANCE LOCKED");
