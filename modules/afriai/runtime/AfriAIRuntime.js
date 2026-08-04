import AfriAIProviderRegistry from "../providers/bootstrap.js";
import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";
import AfriAIProviderHealth from "../providers/health/AfriAIProviderHealth.js";
import AfriAIResponseNormalizer from "../response/AfriAIResponseNormalizer.js";

export class AfriAIRuntime {

  constructor(){
    this.status = "ready";
  }

  async ask(message){

    console.log("🤖 AFRIAI RUNTIME HIT:", message);

    const knowledge =
      AfriAIKnowledgeRetriever.retrieve(message);

    const prompt = `
You are AfriAI, the official intelligence assistant of AfriDigital.

Rules:
- Answer using only AfriDigital knowledge provided.
- Do not invent features.
- Represent AfriDigital professionally.

Knowledge:
${JSON.stringify(knowledge)}

User:
${message}

AfriAI:
`;

    const providers = [
      AfriAIProviderRegistry.get("ollama"),
      AfriAIProviderRegistry.get("knowledge")
    ];

    for(const provider of providers){

      if(!provider) continue;

      const healthy =
        await AfriAIProviderHealth.check(provider);

      if(!healthy){
        console.log(
          "⏭️ Skipping unhealthy provider:",
          provider.name
        );
        continue;
      }

      try{

        const reply =
          await provider.generate(prompt);

        if(reply && reply.trim()){
          return AfriAIResponseNormalizer.normalize(reply);
        }

      }catch(error){

        console.log(
          "⚠️ AfriAI provider failed:",
          provider.name,
          error.message
        );

      }
    }

    return JSON.stringify({
      provider:"runtime",
      status:"NO_PROVIDER_AVAILABLE",
      knowledge
    });

  }

}

export const afriAIRuntime = new AfriAIRuntime();

export function init(server){
  console.log("🧠 AfriAI Runtime initialized");
}

export default afriAIRuntime;
