const MAX_OUTPUT_TOKENS=16384;
const MAX_TIMEOUT_MS=300000;

function boundedNumber(value,fallback,min,max){
  const number=Number(value);
  if(!Number.isFinite(number)) return fallback;
  return Math.min(max,Math.max(min,Math.floor(number)));
}

export function createAfriGenerationGateway({
  providerRegistry,
  profileRegistry,
  providerSelection={},
  defaultProvider=null
}={}){
  if(!providerRegistry || typeof providerRegistry.get!=="function") throw new Error("AFRI_LLM_PROVIDER_REGISTRY_REQUIRED");
  if(!profileRegistry || typeof profileRegistry.get!=="function") throw new Error("AFRI_GENERATION_PROFILE_REGISTRY_REQUIRED");

  return Object.freeze({
    async generate({prompt,profile="conversation",provider:providerOverride=null,model=null,options={}}={}){
      if(typeof prompt!=="string" || !prompt.trim()) throw new Error("AFRI_GENERATION_PROMPT_REQUIRED");

      const profileConfig=profileRegistry.get(profile);
      if(!profileConfig) throw new Error("AFRI_GENERATION_PROFILE_UNKNOWN");

      const selectedName=providerOverride || providerSelection[profile] || defaultProvider;
      if(!selectedName) throw new Error("AFRI_LLM_PROVIDER_NOT_SELECTED");

      const selectedProvider=providerRegistry.get(selectedName);
      if(!selectedProvider) throw new Error("AFRI_LLM_PROVIDER_NOT_REGISTERED");
      if(typeof selectedProvider.supports==="function" && !selectedProvider.supports("generate")) {
        throw new Error("AFRI_LLM_PROVIDER_CAPABILITY_UNAVAILABLE");
      }

      if(typeof selectedProvider.health==="function"){
        const health=await selectedProvider.health();
        if(health?.status==="UNAVAILABLE" || health?.status==="ERROR"){
          throw new Error("AFRI_LLM_PROVIDER_UNAVAILABLE");
        }
      }

      const request={
        prompt,
        profile,
        model:model || null,
        maxOutputTokens:boundedNumber(options.maxOutputTokens,profileConfig.maxOutputTokens,1,MAX_OUTPUT_TOKENS),
        timeoutMs:boundedNumber(options.timeoutMs,profileConfig.timeoutMs,1000,MAX_TIMEOUT_MS),
        temperature:Number.isFinite(Number(options.temperature))?Math.min(2,Math.max(0,Number(options.temperature))):profileConfig.temperature,
        responseFormat:options.responseFormat || profileConfig.responseFormat || "text"
      };

      const startedAt=Date.now();
      const raw=await selectedProvider.generate(request);
      const result=typeof raw==="string"?{content:raw}:raw;

      if(!result || typeof result.content!=="string" || !result.content.trim()) {
        throw new Error("AFRI_LLM_EMPTY_RESPONSE");
      }

      return {
        ok:true,
        provider:result.provider || selectedProvider.name,
        model:result.model || model || null,
        profile,
        content:result.content,
        usage:result.usage || null,
        latencyMs:Date.now()-startedAt
      };
    }
  });
}
export default createAfriGenerationGateway;
