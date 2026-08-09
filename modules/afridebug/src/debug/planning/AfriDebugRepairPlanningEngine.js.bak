import Recommendation from "../recommendation/AfriDebugRecommendationEngine.js";

const AfriDebugRepairPlanningEngine = {

  plan(input = {}) {

    const recommendation =
      Recommendation.recommend({
        issue: input.issue
      });


    const best =
      recommendation.recommendations[0] || null;


    return {

      planId:
        `PLAN-${Date.now()}`,

      issue:
        input.issue || null,

      diagnosis:
        best?.diagnosis || "unknown",

      action:
        best?.fix || "manual investigation required",

      files:
        input.files || [],

      risk:
        input.risk || "medium",

      approvalRequired:true,

      confidence:
        recommendation.confidence,

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
