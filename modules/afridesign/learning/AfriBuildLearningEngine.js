import AfriBuildKnowledgeRegistry from "../knowledge/AfriBuildKnowledgeRegistry.js";

const AfriBuildLearningEngine = {

 learn(data={}){

  if(data.status !== "CERTIFIED"){
   return {
    status:"SKIPPED",
    reason:"BUILD_NOT_CERTIFIED"
   };
  }

  return AfriBuildKnowledgeRegistry.remember({

   type:data.type || "web_app",

   features:data.features || [],

   stack:data.stack || [
    "React",
    "Vite",
    "CSS"
   ],

   artifact:{
    id:data.artifactId,
    provider:data.provider
   }

  });

 }

};

export default AfriBuildLearningEngine;
