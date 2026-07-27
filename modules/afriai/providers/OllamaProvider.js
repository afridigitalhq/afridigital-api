import askOllama from "../../../src/afriai/llm/OllamaClient.js";

const OllamaProvider = {

  name:"ollama",

  async generate(prompt){

    return await askOllama(prompt);

  }

};

export default OllamaProvider;
