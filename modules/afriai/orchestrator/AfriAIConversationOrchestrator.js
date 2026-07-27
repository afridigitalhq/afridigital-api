import AfriAIConversationRuntime from "../conversation/AfriAIConversationRuntime.js";
import AfriAIIntentRouter from "../intents/AfriAIIntentRouter.js";
import AfriAIToolExecutor from "../tools/AfriAIToolExecutor.js";

const AfriAIConversationOrchestrator = {

  process(request){

    const session =
      AfriAIConversationRuntime.start(
        request.sessionId,
        request.message
      );

    const intent =
      AfriAIIntentRouter.resolve(
        request.message
      );

    const execution =
      AfriAIToolExecutor.execute(
        intent
      );

    return {
      session,
      intent,
      execution,
      status:"AI_RESPONSE_READY"
    };

  }

};

export default AfriAIConversationOrchestrator;
