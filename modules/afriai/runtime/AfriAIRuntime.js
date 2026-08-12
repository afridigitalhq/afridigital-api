import AfriAIProviderRegistry from "../providers/bootstrap.js";
import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";
import AfriAIProviderHealth from "../providers/health/AfriAIProviderHealth.js";
import AfriAIResponseNormalizer from "../response/AfriAIResponseNormalizer.js";
import AfriAIGroundingGuard from "../guards/AfriAIGroundingGuard.js";
import AfriAIKnowledgeProjection from "../prompt/AfriAIKnowledgeProjection.js";
import AfriAIExecutionTrace from "../execution/trace/AfriAIExecutionTrace.js";
import CoreTraceEngine from "../../core/trace/CoreTraceEngine.js";

export class AfriAIRuntime {

  constructor(){
    this.status = "ready";
  }

  async ask(message){

    const trace =
      AfriAIExecutionTrace.start();

    const debugRequestId =
      CoreTraceEngine.start("AfriAI");

    console.log("🤖 AFRIAI RUNTIME HIT:", message);

    CoreTraceEngine.event(
      debugRequestId,
      "REQUEST_RECEIVED",
      {
        service:"AfriAI",
        message
      }
    );
    CoreTraceEngine.inspect({stage:"runtime_start",message});

    const knowledge =
      AfriAIKnowledgeRetriever.retrieve(message);

    const projectedKnowledge =
      AfriAIKnowledgeProjection.project(
        message,
        knowledge
      );

    const prompt = `
You are AfriAI, the official intelligence assistant of AfriDigital.

Rules:
- Answer using only the AfriDigital knowledge provided.
- Do not invent features, products, capabilities, dates, or claims.
- Be concise and professional.
- Answer in 1-2 sentences unless the user asks for detail.

Knowledge:
${JSON.stringify(projectedKnowledge)}

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

          const grounding =
            AfriAIGroundingGuard.evaluate(
              reply,
              knowledge
            );

          CoreTraceEngine.event(
            debugRequestId,
            "GROUNDING_VALIDATION",
            {
              supported:grounding.supported,
              status:grounding.status,
              unsupportedClaims:grounding.unsupportedClaims
            }
          );

          if(!grounding.supported){

            console.log(
              "⚠️ AfriAI grounding rejected:",
              grounding.unsupportedClaims
            );

            continue;
          }

          const normalized =
            AfriAIResponseNormalizer.normalize(reply);

          normalized.trace =
            AfriAIExecutionTrace.finish(
              trace,
              {
                selectedProvider:provider.name
              }
            );

          CoreTraceEngine.event(
              debugRequestId,
              "FINAL_OUTPUT",
              {
                provider:normalized.provider,
                status:normalized.status
              }
            );

            normalized.debug =
              CoreTraceEngine.finish(debugRequestId);

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
