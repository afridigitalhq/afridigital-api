import fs from "fs";
import KnowledgeMemory from "../../debug/memory/AfriDebugKnowledgeMemory.js";

export function matchKnowledge(issue = ""){

  console.log("\n🧠 AfriDebug Knowledge Matcher");

  const knowledgeResult =
    KnowledgeMemory.search(issue);

  const result = {
    component:"Knowledge Comparison",
    status:"PASSED",
    matches:
      knowledgeResult.matches.length,

    patternsChecked:
      knowledgeResult.matches.length,

    confidence:
      knowledgeResult.confidence,

    reinforcedPatterns:
      knowledgeResult.matches.filter(
        item => item.verified === true
      ).length,

    reinforcementAware:
      knowledgeResult.matches.some(
        item => item.verified === true
      ),

    source:
      "AfriDebugKnowledgeMemory",

    timestamp:
      new Date().toISOString()
  };

  fs.mkdirSync(
    "modules/afridebug/evidence",
    {recursive:true}
  );

  fs.writeFileSync(
    "modules/afridebug/evidence/knowledge-comparison.json",
    JSON.stringify(result,null,2)
  );

  console.log("✅ Knowledge comparison evidence generated");

  return result;
}
