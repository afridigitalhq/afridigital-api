const AfriAIResponseNormalizer = {

normalize(providerResponse){

 try{

   const data =
     typeof providerResponse === "string"
       ? JSON.parse(providerResponse)
       : providerResponse;

   if(data?.provider === "knowledge"){

     const knowledge = data.knowledge || {};

     let answer =
       knowledge.platform?.description ||
       "AfriDigital knowledge response ready.";

     if(knowledge.products?.AfriCommerce){
       answer =
        `AfriCommerce is ${knowledge.products.AfriCommerce.description} ` +
        `Current status: ${knowledge.products.AfriCommerce.status}.`;
     }

     return {
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
