const AfriAISessionManager = {

  create(sessionId){
    return {
      sessionId,
      status:"ACTIVE",
      context:[]
    };
  },

  addContext(session, message){
    session.context.push(message);
    return session;
  }

};

export default AfriAISessionManager;
