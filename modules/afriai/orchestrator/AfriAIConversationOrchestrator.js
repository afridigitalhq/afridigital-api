import AfriAIConversationRuntime from "../conversation/AfriAIConversationRuntime.js";
import AfriAIIntentRouter from "../intents/AfriAIIntentRouter.js";
import AfriAIToolExecutor from "../tools/AfriAIToolExecutor.js";
import afriAIRuntime from "../runtime/AfriAIRuntime.js";

const AfriAIConversationOrchestrator = {

  async process(request){

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

    const response =
      await afriAIRuntime.ask(
        request.message
      );

    return {
      session,
      intent,
      execution:{
        ...execution,
        response
      },
      status:"AI_RESPONSE_READY"
    };

  }

};

export default AfriAIConversationOrchestrator;
