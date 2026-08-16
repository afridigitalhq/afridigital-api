import Diagnosis from "./AfriDebugDiagnosisEngine.js";
import PatchAdvisor from "./AfriDebugPatchAdvisor.js";
import RiskEngine from "./AfriDebugRiskEngine.js";
import Similarity from "./AfriDebugSimilarityEngine.js";
import Recommender from "./AfriDebugSolutionRecommender.js";
import CaseMemory from "../../../../src/afridebug/platform/knowledge/AfriDebugCaseMemory.js";
import PatternMatcher from "../../../../src/afridebug/platform/knowledge/AfriDebugPatternMatcher.js";
import KnowledgeMemory from "../../../../src/afridebug/platform/knowledge/AfriDebugKnowledgeAdapter.js";

const AfriDebugAssistant = {

  investigate(input = {}){

    const diagnosis =
      Diagnosis.analyze(input);

    const patchPlan =
      PatchAdvisor.propose(diagnosis);

    const risk =
      RiskEngine.assess(patchPlan);

    const knowledge =
      KnowledgeMemory.search(
        diagnosis.issue
      );

    const ranked =
      Similarity.compare(
        diagnosis.issue,
        knowledge.matches
      );

    const recommendation =
      Recommender.recommend(
        ranked
      );

    return {

      service:"AfriDebugAssistant",

      status:"ANALYZED",

      diagnosis,

      patchPlan,

      risk,

      knowledge,
      ranked,
      recommendation,

      nextAction:
        "AWAIT_HUMAN_APPROVAL",

      humanApprovalRequired:true,

      analyzedAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugAssistant",
      status:"healthy"
    };

  }

};

export default AfriDebugAssistant;
