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

     const message =
       String(context.message || "").toLowerCase();

     const asksPlatform =
       message.includes("what is afridigital") ||
       message.includes("tell me about afridigital") ||
       message.includes("about afridigital") ||
       message.includes("what is afri digital");

     const asksCommerce =
       message.includes("africommerce") ||
       message.includes("afri commerce");

     let answer;

     if(asksPlatform && knowledge.platform?.platform?.description){

       answer =
        knowledge.platform.platform.description;

     }else if(asksCommerce && knowledge.products?.AfriCommerce){

       answer =
        `AfriCommerce is ${knowledge.products.AfriCommerce.description} ` +
        `Current status: ${knowledge.products.AfriCommerce.status}.`;

     }else{

       answer =
         knowledge.platform?.platform?.description ||
         knowledge.studio?.description ||
         knowledge.payments?.description ||
         knowledge.roadmap?.description ||
         knowledge.status?.description ||
         "AfriDigital knowledge response ready.";

     }

     CoreTraceEngine.inspect({
       stage:"NORMALIZED_RESPONSE_OUTPUT",
       answer
     });

     const normalizedResponse = {
       provider:data.provider,
       reply:answer,
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

     CoreTraceEngine.event(
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
