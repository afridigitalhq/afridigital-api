import Recommendation from "../recommendation/AfriDebugRecommendationEngine.js";

const AfriDebugRepairPlanningEngine = {

  plan(input = {}) {

    const recommendation =
      Recommendation.recommend({
        issue: input.issue
      });


    const best =
      recommendation.recommendation?.recommendation || null;


    return {

      planId:
        `PLAN-${Date.now()}`,

      issue:
        input.issue || null,

      diagnosis:
        best?.diagnosis || "unknown",

      action:
        best?.resolution || "manual investigation required",

      files:
        input.files || [],

      risk:
        input.risk || "medium",

      approvalRequired:true,

      confidence:
        recommendation.confidence,

      source:
        "AfriDebugKnowledgeMemory",

      createdAt:
        Date.now()

    };

  },


  health(){

    return {

      service:"AfriDebugRepairPlanningEngine",

      status:"healthy"

    };

  }

};


export default AfriDebugRepairPlanningEngine;
