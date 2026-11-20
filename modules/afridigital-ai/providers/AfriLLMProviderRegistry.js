export function createAfriLLMProviderRegistry(){
  const providers=new Map();
  return Object.freeze({
    register(provider){
      if(!provider?.name || typeof provider.generate!=="function") throw new Error("AFRI_LLM_PROVIDER_INVALID");
      providers.set(provider.name,provider);
      return provider;
    },
    get(name){return providers.get(name)||null},
    list(){return [...providers.keys()]},
    has(name){return providers.has(name)},
    unregister(name){return providers.delete(name)}
  });
}
export default createAfriLLMProviderRegistry;
