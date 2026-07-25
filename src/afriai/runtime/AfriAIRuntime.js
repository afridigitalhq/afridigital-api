import askOllama from "../llm/OllamaClient.js";
import AfriPlatformKnowledge from "../knowledge/AfriPlatformKnowledge.js";
import ProductKnowledge from "../knowledge/ProductKnowledge.js";
import StudioKnowledge from "../knowledge/StudioKnowledge.js";
import PaymentsKnowledge from "../knowledge/PaymentsKnowledge.js";
import StatusKnowledge from "../knowledge/StatusKnowledge.js";

export class AfriAIRuntime {

  constructor(){
    this.status = "ready";
  }

  async ask(message){

    const knowledge = {
      platform: AfriPlatformKnowledge,
      products: ProductKnowledge,
      studio: StudioKnowledge,
      payments: PaymentsKnowledge,
      status: StatusKnowledge
    };

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

    return await askOllama(prompt);
  }

}

export const afriAIRuntime = new AfriAIRuntime();

export function init(server){
  console.log("🧠 AfriAI Runtime initialized");
}

export default afriAIRuntime;
