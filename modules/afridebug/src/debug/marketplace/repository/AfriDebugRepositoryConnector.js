const repositories = [];

const AfriDebugRepositoryConnector = {

  attach(input = {}) {

    const repository = {

      id:`REPO-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      jobId:input.jobId || null,

      type:input.type || "GITHUB",

      url:input.url || null,

      branch:input.branch || "main",

      status:"CONNECTED",

      createdAt:Date.now()
    };

    repositories.push(repository);

    return repository;
  },


  get(id){

    return repositories.find(
      x=>x.id===id
    );
  },


  list(){
    return repositories;
  },


  stats(){

    return {
      repositories:repositories.length
    };
  }

};

export default AfriDebugRepositoryConnector;
