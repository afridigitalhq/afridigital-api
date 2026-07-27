import AfriAISessionManager from "./AfriAISessionManager.js";

const AfriAIConversationRuntime = {

  start(sessionId,message){

    const session =
      AfriAISessionManager.create(sessionId);

    return AfriAISessionManager.addContext(
      session,
      message
    );

  }

};

export default AfriAIConversationRuntime;
