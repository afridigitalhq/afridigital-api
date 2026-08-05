import AfriAIProviderRegistry from "../providers/bootstrap.js";
import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";
import AfriAIProviderHealth from "../providers/health/AfriAIProviderHealth.js";
import AfriAIResponseNormalizer from "../response/AfriAIResponseNormalizer.js";
import AfriAIExecutionTrace from "../execution/trace/AfriAIExecutionTrace.js";
import AfriDebugRuntime from "../../platform/observability/debug/AfriDebugRuntime.js";

export class AfriAIRuntime {

  constructor(){
    this.status = "ready";
  }

  async ask(message){

    const trace =
      AfriAIExecutionTrace.start();

    const debugRequestId =
      AfriDebugRuntime.start("AfriAI");

    console.log("🤖 AFRIAI RUNTIME HIT:", message);

    AfriDebugRuntime.event(
      debugRequestId,
      "REQUEST_RECEIVED",
      {
        service:"AfriAI",
        message
      }
    );
    AfriDebugRuntime.inspect({stage:"runtime_start",message});

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

        trace.providersChecked.push({
          provider:provider.name,
          status:"UNAVAILABLE"
        });

        console.log(
          "⏭️ Skipping unhealthy provider:",
          provider.name
        );

        continue;
      }

      trace.providersChecked.push({
        provider:provider.name,
        status:"READY"
      });

      try{

        const reply =
          await provider.generate(prompt);

        if(reply && reply.trim()){

          trace.selectedProvider =
            provider.name;

          const normalized =
            AfriAIResponseNormalizer.normalize(reply);

          normalized.trace =
            AfriAIExecutionTrace.finish(
              trace,
              {
                selectedProvider:provider.name
              }
            );

          AfriDebugRuntime.event(
            "FINAL_OUTPUT",
            {
              provider:normalized.provider,
              status:normalized.status
            }
          );

          AfriDebugRuntime.event(
              debugRequestId,
              "FINAL_OUTPUT",
              {
                provider:normalized.provider,
                status:normalized.status
              }
            );

            normalized.debug =
              AfriDebugRuntime.finish(debugRequestId);

            return normalized;
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
