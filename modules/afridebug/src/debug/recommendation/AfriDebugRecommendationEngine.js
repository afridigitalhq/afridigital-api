import KnowledgeMemory from "../memory/AfriDebugKnowledgeMemory.js";
import SolutionRecommender from "../intelligence/AfriDebugSolutionRecommender.js";

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
        "AfriDebugKnowledgeMemory",

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
