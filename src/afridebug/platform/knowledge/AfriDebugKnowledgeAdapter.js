import KnowledgeMemory from "./AfriDebugKnowledgeMemoryService.js";

const AfriDebugKnowledgeAdapter = {

  search(issue){

    return KnowledgeMemory.search(issue);

  },

  remember(data){

    return KnowledgeMemory.remember(data);

  },

  reinforce(data){

    return KnowledgeMemory.reinforce(data);

  },

  health(){

    return {
      service:"AfriDebugKnowledgeAdapter",
      target:KnowledgeMemory.health(),
      status:"healthy"
    };

  }

};

export default AfriDebugKnowledgeAdapter;
