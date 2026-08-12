import AppDeployAdapter from "../appdeploy/AppDeployAdapter.js";
import MockBuilderAdapter from "../mock/MockBuilderAdapter.js";
import OllamaBuilderAdapter from "../llm/OllamaBuilderAdapter.js";

const AfriDesignProviderRegistry = {
  providers:{
    appdeploy:AppDeployAdapter,
    mock:MockBuilderAdapter,
    ollama:OllamaBuilderAdapter
  },

  get(provider){
    return this.providers[provider] || null;
  },

  list(){
    return Object.keys(this.providers);
  }
};

export default AfriDesignProviderRegistry;
