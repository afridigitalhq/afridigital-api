import AppDeployAdapter from "../appdeploy/AppDeployAdapter.js";
import MockBuilderAdapter from "../mock/MockBuilderAdapter.js";
import OllamaBuilderAdapter from "../llm/OllamaBuilderAdapter.js";
import NativeAndroidBuilderAdapter from "../native/NativeAndroidBuilderAdapter.js";

const AfriDesignProviderRegistry = {
  providers:{
    appdeploy:AppDeployAdapter,
    mock:MockBuilderAdapter,
    ollama:OllamaBuilderAdapter,
    native_android:NativeAndroidBuilderAdapter
  },

  get(provider){
    return this.providers[provider] || null;
  },

  list(){
    return Object.keys(this.providers);
  }
};

export default AfriDesignProviderRegistry;
