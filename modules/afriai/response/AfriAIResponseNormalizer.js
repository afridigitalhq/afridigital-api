import AfriDebugRuntime from "../../platform/observability/debug/AfriDebugRuntime.js";

const AfriAIResponseNormalizer = {

normalize(providerResponse){

 try{

   const data =
     typeof providerResponse === "string"
       ? JSON.parse(providerResponse)
       : providerResponse;

   if(data?.provider === "knowledge"){

     const knowledge = data.knowledge || {};

     AfriDebugRuntime.inspect({
       stage:"NORMALIZED_RESPONSE_INPUT",
       knowledgeKeys:Object.keys(knowledge)
     });

     let answer =
       knowledge.platform?.description ||
       knowledge.studio?.description ||
       knowledge.payments?.description ||
       knowledge.roadmap?.description ||
       knowledge.status?.description ||
       "AfriDigital knowledge response ready.";

     if(knowledge.products?.AfriCommerce){
       answer =
        `AfriCommerce is ${knowledge.products.AfriCommerce.description} ` +
        `Current status: ${knowledge.products.AfriCommerce.status}.`;
     }

     AfriDebugRuntime.inspect({
       stage:"NORMALIZED_RESPONSE_OUTPUT",
       answer
     });

     const normalizedResponse = {
       provider:data.provider,
       answer,
       sources:data.sources || [
        "AfriPlatformKnowledge",
        "ProductKnowledge"
       ],
       confidence:data.confidence || "HIGH",
       executionPath:data.executionPath || [
        "KnowledgeRetriever",
        "ResponseNormalizer"
       ],
       status:"READY"
     };

     AfriDebugRuntime.event(
       "NORMALIZED_RESPONSE",
       {
         provider:normalizedResponse.provider,
         status:normalizedResponse.status
       }
     );

     return normalizedResponse;

   }

   return {
     provider:data?.provider || "unknown",
     answer:data?.answer || String(providerResponse),
     sources:data?.sources || [],
     confidence:data?.confidence || "LOW",
     executionPath:[
       "ResponseNormalizer"
     ],
     status:"READY"
   };

 }catch(error){

   return {
     provider:"unknown",
     answer:String(providerResponse),
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
