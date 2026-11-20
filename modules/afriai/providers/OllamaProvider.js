import askOllama from "../llm/OllamaClient.js";

const OllamaProvider={
  name:"ollama",
  capabilities:["generate"],
  async generate(prompt,options={}){
    return askOllama(prompt,options);
  }
};
export default OllamaProvider;
