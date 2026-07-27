const AfriAIContextStore = {

  sessions:{},

  save(sessionId,context){
    this.sessions[sessionId]=context;
    return context;
  },

  get(sessionId){
    return this.sessions[sessionId] || null;
  }

};

export default AfriAIContextStore;
