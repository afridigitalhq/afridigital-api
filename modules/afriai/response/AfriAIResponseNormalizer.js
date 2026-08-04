const AfriAIResponseNormalizer = {

 normalize(providerResponse){

  try{

   if(typeof providerResponse === "string"){

    return JSON.parse(providerResponse);

   }

   return providerResponse;

  }catch(error){

   return {
    provider:"unknown",
    answer:providerResponse,
    sources:[],
    confidence:"LOW",
    executionPath:[
      "RawProviderResponse"
    ],
    status:"READY"
   };

  }

 }

};

export default AfriAIResponseNormalizer;
