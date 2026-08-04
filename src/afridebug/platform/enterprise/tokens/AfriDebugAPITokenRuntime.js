const tokens=[];

const AfriDebugAPITokenRuntime={

  issue(input={}){

    const token={
      id:`TOKEN-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      workspaceId:input.workspaceId||null,
      token:`AFRI-${Math.random().toString(36).slice(2,18)}`,
      createdAt:Date.now()
    };

    tokens.push(token);

    return token;

  },

  list(){ return tokens; },

  stats(){ return { tokens:tokens.length }; }

};

export default AfriDebugAPITokenRuntime;
