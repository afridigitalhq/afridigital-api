import KnowledgeMemory from "../../../../src/afridebug/platform/knowledge/AfriDebugKnowledgeAdapter.js";
import SolutionRecommender from "../../../../src/afridebug/platform/intelligence/AfriDebugSolutionRecommender.js";

const AfriDebugRecommendationEngine = {

  recommend(input = {}) {

    const result =
      KnowledgeMemory.search(
        input.issue || ""
      );

    const matches =
      result.matches || [];

    const ranked =
      matches.map(item => ({
        ...item,
        similarity:
          item.issue &&
          input.issue &&
          item.issue.toLowerCase()
          === input.issue.toLowerCase()
            ? 1
            : 0.5
      }));

    return {

      issue:
        input.issue || null,

      matches:
        ranked.length,

      recommendation:
        SolutionRecommender.recommend(
          ranked
        ),

      source:
        "AfriDebugKnowledgeMemoryService",

      verifiedPatterns:
        ranked.filter(
          item => item.verified === true
        ).length,

      explanation:
        ranked.length
          ? "Recommendation based on historical repair patterns"
          : "No verified repair history available",

      evidenceTrace:{
        matchedCases:
          ranked.map(item => item.id || null),

        verifiedCases:
          ranked.filter(
            item => item.verified === true
          ).length,

        source:
          "AfriDebugKnowledgeMemoryService"
      },

      approvalContext:{
        required:true,
        status:"PENDING_HUMAN_APPROVAL",
        executionMode:"AFRINUCCHAIN_APPROVAL"
      },

      confidence:
        ranked.length
          ? "historical_match"
          : "no_history"

    };

  },


  health(){

    return {
      service:"AfriDebugRecommendationEngine",
      status:"healthy"
    };

  }

};

export default AfriDebugRecommendationEngine;
