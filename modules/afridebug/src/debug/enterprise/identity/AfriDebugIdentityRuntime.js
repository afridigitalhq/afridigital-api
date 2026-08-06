const identities=[];

const AfriDebugIdentityRuntime={

  register(input={}){

    const identity={
      id:`IDENTITY-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      organizationId:input.organizationId||null,
      email:input.email||null,
      verified:false,
      createdAt:Date.now()
    };

    identities.push(identity);

    return identity;

  },

  list(){ return identities; },

  stats(){ return { identities:identities.length }; }

};

export default AfriDebugIdentityRuntime;
