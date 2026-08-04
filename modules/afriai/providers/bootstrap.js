import AfriAIProviderRegistry from "./AfriAIProviderRegistry.js";
import OllamaProvider from "./OllamaProvider.js";
import KnowledgeProvider from "./KnowledgeProvider.js";

AfriAIProviderRegistry.register(
  OllamaProvider.name,
  OllamaProvider
);

AfriAIProviderRegistry.register(
  KnowledgeProvider.name,
  KnowledgeProvider
);

export default AfriAIProviderRegistry;
