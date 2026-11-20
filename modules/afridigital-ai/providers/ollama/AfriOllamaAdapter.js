import {createAfriLLMProviderContract} from "../../contracts/AfriLLMProviderContract.js";
import OllamaProvider from "../../../afriai/providers/OllamaProvider.js";
import AfriAIProviderHealth from "../../../afriai/providers/health/AfriAIProviderHealth.js";

export function createAfriOllamaAdapter({provider=OllamaProvider,healthCheck=AfriAIProviderHealth.check}={}){
  if(!provider||typeof provider.generate!=="function") {
    throw new Error("AFRI_OLLAMA_ADAPTER_PROVIDER_INVALID");
  }

  return createAfriLLMProviderContract({
    name:"ollama",
    capabilities:["generate"],
    health:async()=>{
        try{
          const available=await healthCheck(provider);
          return {status:available?"AVAILABLE":"UNAVAILABLE",provider:"ollama"};
        }catch{
          return {status:"ERROR",provider:"ollama"};
        }
      },
    generate:async(request={})=>{
      const content=await provider.generate(request.prompt,{
        model:request.model||undefined,
        maxOutputTokens:request.maxOutputTokens,
        timeoutMs:request.timeoutMs,
        temperature:request.temperature,
        responseFormat:request.responseFormat
      });
      if(typeof content!=="string"||!content.trim()) {
        throw new Error("AFRI_OLLAMA_EMPTY_RESPONSE");
      }
      return {
        provider:"ollama",
        model:request.model||null,
        content,
        usage:null
      };
    }
  });
}
export default createAfriOllamaAdapter;
