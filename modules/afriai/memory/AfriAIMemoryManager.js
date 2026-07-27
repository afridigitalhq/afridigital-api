import AfriAIContextStore from "./AfriAIContextStore.js";

const AfriAIMemoryManager = {

  remember(sessionId,message){

    const context =
      AfriAIContextStore.get(sessionId) || [];

    context.push(message);

    return AfriAIContextStore.save(
      sessionId,
      context
    );

  },

  recall(sessionId){

    return AfriAIContextStore.get(sessionId);

  }

};

export default AfriAIMemoryManager;
