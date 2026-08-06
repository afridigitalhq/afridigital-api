const bindings = [];

const AfriDebugRepositoryBinding = {

  bind(input = {}) {

    const binding = {

      id:`BIND-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:input.investigationId || null,

      repositoryId:input.repositoryId || null,

      source:{
        type:input.type || null,
        url:input.url || null,
        branch:input.branch || "main"
      },

      status:"BOUND",

      createdAt:Date.now()
    };

    bindings.push(binding);

    return binding;
  },


  get(id){
    return bindings.find(
      x=>x.id===id
    );
  },


  stats(){
    return {
      bindings:bindings.length
    };
  }

};

export default AfriDebugRepositoryBinding;
