import AfriAIIntentRouter from "../intents/router/AfriAIIntentRouter.js";
import AfriAIIntentExecutor from "../intents/executor/AfriAIIntentExecutor.js";
import AfriAIKnowledgeRuntime from "../../knowledge-governance/retrieval/AfriAIKnowledgeRuntime.js";
import AfriAIDecisionResolver from "../../decision/resolver/AfriAIDecisionResolver.js";

export class AfriAIRuntimeOrchestrator {

  run(message = "", context = {}) {

    const decision = AfriAIDecisionResolver.resolve(message);
    const intent = AfriAIIntentRouter.route(message);
    const knowledge = AfriAIKnowledgeRuntime.retrieve(message, context);
    const execution = AfriAIIntentExecutor.execute(intent, knowledge);

    return {
      decision,
      intent,
      knowledge,
      execution,
      status: "READY"
    };

  }

}
