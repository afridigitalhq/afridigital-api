import askOllama from "../llm/OllamaClient.js";
import AfriPlatformKnowledge from "../knowledge/AfriPlatformKnowledge.js";
import ProductKnowledge from "../knowledge/ProductKnowledge.js";
import StudioKnowledge from "../knowledge/StudioKnowledge.js";
import PaymentsKnowledge from "../knowledge/PaymentsKnowledge.js";
import StatusKnowledge from "../knowledge/StatusKnowledge.js";
import AfriAIKnowledgeRetriever from "../../../modules/afriai/knowledge-engine/AfriAIKnowledgeRetriever.js";

export class AfriAIRuntime {

  constructor(){
    this.status = "ready";
  }

  async ask(message){

    const knowledge =
      AfriAIKnowledgeRetriever.retrieve(message);

    const prompt = `
You are AfriAI, the official intelligence assistant of AfriDigital.

Rules:
- Answer using only the AfriDigital knowledge provided.
- Do not invent features, services, or availability.
- If a request requires human involvement, recommend support assistance.
- Represent AfriDigital professionally.

Knowledge:
${JSON.stringify(knowledge)}

User:
${message}

AfriAI:
`;

    const llmReply = await askOllama(prompt);

    if (llmReply && llmReply.trim()) {
      return llmReply;
    }

    return `I'm AfriAI, the intelligence assistant of AfriDigital. I can help you explore our products, AfriDesign Studio, platform capabilities, development status, and ecosystem roadmap. Please ask me about AfriDigital features or products.`;
  }

}

export const afriAIRuntime = new AfriAIRuntime();

export function init(server){
  console.log("🧠 AfriAI Runtime initialized");
}

export default afriAIRuntime;
