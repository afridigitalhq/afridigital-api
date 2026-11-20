export function createAfriLLMProviderContract({name,generate,health=null,capabilities=["generate"]}={}){
  if(typeof name!=="string" || !name.trim()) throw new Error("AFRI_LLM_PROVIDER_NAME_REQUIRED");
  if(typeof generate!=="function") throw new Error("AFRI_LLM_PROVIDER_GENERATE_REQUIRED");
  return Object.freeze({
    name:name.trim(),
    type:"AFRI_LLM_PROVIDER",
    capabilities:Object.freeze([...new Set(capabilities)]),
    supports(capability){return this.capabilities.includes(capability)},
    async generate(request={}){return generate(request)},
    async health(){return typeof health==="function"?health():{status:"UNKNOWN",provider:this.name}}
  });
}
