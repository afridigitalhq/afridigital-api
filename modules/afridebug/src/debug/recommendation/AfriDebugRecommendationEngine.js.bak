import Memory from "../learning/AfriDebugLearningMemory.js";

const AfriDebugRecommendationEngine = {

  recommend(input = {}) {

    const matches =
      Memory.findByIssue(input.issue);


    const successful =
      matches.filter(
        item => item.success === true
      );


    return {

      issue:
        input.issue || null,

      matches:
        matches.length,

      recommendations:
        successful.map(item=>({

          fix:item.fix,

          diagnosis:item.diagnosis,

          verification:item.verification

        })),

      confidence:
        successful.length
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
