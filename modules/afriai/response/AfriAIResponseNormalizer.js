import CoreTraceEngine from "../../core/trace/CoreTraceEngine.js";

const AfriAIResponseNormalizer = {

normalize(providerResponse, context = {}){

 try{

   let data;

   if(typeof providerResponse === "string"){

     try{
       data = JSON.parse(providerResponse);
     }catch{

       return {
         provider:"ollama",
         reply:providerResponse,
         sources:[],
         confidence:"LOW",
         executionPath:[
           "OllamaRawResponse",
           "ResponseNormalizer"
         ],
         status:"READY"
       };

     }

   }else{

     data = providerResponse;

   }

   if(data?.provider === "knowledge"){
     const knowledge = data.knowledge || {};
     CoreTraceEngine.inspect({
       stage:"NORMALIZED_RESPONSE_INPUT",
       knowledgeKeys:Object.keys(knowledge)
     });

     if(data.grounded !== true || data.status !== "READY" || typeof data.answer !== "string" || !data.answer.trim()){
       return {
         provider:"knowledge",
         reply:null,
         sources:data.sources || [],
         confidence:"LOW",
         executionPath:data.executionPath || ["KnowledgeRetriever","ResponseNormalizer"],
         status:data.status === "NOT_GROUNDED" ? "NOT_GROUNDED" : "NORMALIZATION_FAILED",
         grounded:false,
         error:data.error || "KNOWLEDGE_RESPONSE_INVALID"
       };
     }

     const normalizedResponse = {
       provider:"knowledge",
       reply:data.answer.trim(),
       sources:data.sources || [],
       confidence:data.confidence || "HIGH",
       executionPath:data.executionPath || ["KnowledgeRetriever","ResponseNormalizer"],
       status:"READY",
       grounded:true
     };

     CoreTraceEngine.inspect({
       stage:"NORMALIZED_RESPONSE_OUTPUT",
       answer:normalizedResponse.reply,
       message:context.message || null
     });

     CoreTraceEngine.event("NORMALIZED_RESPONSE", {
       provider:normalizedResponse.provider,
       status:normalizedResponse.status
     });

     return normalizedResponse;
   }

   return {
     provider:data?.provider || "unknown",
     reply:data?.reply || data?.answer || String(providerResponse),
     intent:data?.intent || "general",
     execution:data?.execution || null,
     availableTools:data?.availableTools || [],
     sources:data?.sources || [],
     confidence:data?.confidence || "LOW",
     executionPath:data?.executionPath || ["ResponseNormalizer"],
     status:"READY"
   };

 }catch(error){

   return {
     provider:"unknown",
     reply:String(providerResponse),
     sources:[],
     confidence:"LOW",
     executionPath:[
       "RawProviderResponse",
       "NormalizationFailure"
     ],
     status:"READY"
   };

 }

}

};

export default AfriAIResponseNormalizer;
