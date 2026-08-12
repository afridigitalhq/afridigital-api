import AfriBuildRecommendationEngine from "./AfriBuildRecommendationEngine.js";
import AfriBuildKnowledgeRegistry from "../knowledge/AfriBuildKnowledgeRegistry.js";


const AfriBuildBuildIntelligence={


 analyze(request={}){


  const recommendations =
   AfriBuildRecommendationEngine.recommend({
    type:request.type || "general"
   });


  const previousBuilds =
   AfriBuildKnowledgeRegistry.recall({
    type:request.buildType || "web_app"
   });


  return {

   request:request.prompt || "",

   recommendations,

   previousBuilds,

   intelligenceApplied:true,

   status:"READY",

   timestamp:
    new Date().toISOString()

  };


 }


};


export default AfriBuildBuildIntelligence;
