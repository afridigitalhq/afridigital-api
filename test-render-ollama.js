import OllamaProvider from "./modules/afriai/providers/OllamaProvider.js";

const result = await OllamaProvider.generate(
  "Explain AfriCommerce in one sentence."
);

console.log(JSON.stringify({
  provider:"ollama",
  result
},null,2));
