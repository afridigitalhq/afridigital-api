import AfriAIProviderRegistry from "./AfriAIProviderRegistry.js";
import OllamaProvider from "./OllamaProvider.js";

AfriAIProviderRegistry.register(
  OllamaProvider.name,
  OllamaProvider
);

export default AfriAIProviderRegistry;
