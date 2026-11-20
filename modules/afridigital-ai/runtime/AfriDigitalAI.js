import {createAfriLLMProviderRegistry} from "../providers/AfriLLMProviderRegistry.js";
import {createAfriGenerationProfileRegistry} from "../profiles/AfriGenerationProfileRegistry.js";
import {createAfriGenerationGateway} from "../gateway/AfriGenerationGateway.js";
import {createAfriOllamaAdapter} from "../providers/ollama/AfriOllamaAdapter.js";

const providerRegistry=createAfriLLMProviderRegistry();
const profileRegistry=createAfriGenerationProfileRegistry();

providerRegistry.register(createAfriOllamaAdapter());

const providerSelection={};
for(const profile of profileRegistry.list()){
  const key=`AFRIDIGITAL_LLM_PROVIDER_${profile.toUpperCase()}`;
  const selected=process.env[key]?.trim();
  if(selected) providerSelection[profile]=selected;
}

const defaultProvider=process.env.AFRIDIGITAL_LLM_PROVIDER?.trim()||"ollama";

export const AfriDigitalAIGateway=createAfriGenerationGateway({
  providerRegistry,
  profileRegistry,
  providerSelection,
  defaultProvider
});

export const AfriDigitalAIProviders=providerRegistry;
export const AfriDigitalAIProfiles=profileRegistry;

export function getAfriDigitalAIStatus(){
  return {
    providers:providerRegistry.list(),
    profiles:profileRegistry.list(),
    defaultProvider,
    configuredProfileOverrides:Object.keys(providerSelection)
  };
}

export default AfriDigitalAIGateway;
