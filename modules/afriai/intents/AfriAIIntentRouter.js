import AfriAIIntentRegistry from "./AfriAIIntentRegistry.js";

const AfriAIIntentRouter = {

  resolve(message){

    return {
      message,
      availableIntents:AfriAIIntentRegistry.load(),
      status:"INTENT_PENDING"
    };

  }

};

export default AfriAIIntentRouter;
