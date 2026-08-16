import CaseMemory from "./AfriDebugCaseMemory.js";
import Matcher from "./AfriDebugPatternMatcher.js";
import Store from "./AfriDebugKnowledgeStore.js";
import Persistence from "./AfriDebugKnowledgePersistence.js";

let hydrated = false;

function hydrate(){

  if(hydrated) return;

  const records = Persistence.load();

  records.forEach(record => {
    CaseMemory.store(record);
  });

  hydrated = true;
}

const AfriDebugKnowledgeMemoryService = {

  remember(data){

    hydrate();

    const record = CaseMemory.store(data);

    Store.save(record);

    return record;

  },


  search(issue){

    hydrate();

    return Matcher.match(
      issue,
      CaseMemory.list()
    );

  },


  reinforce(data={}){

    if(!data.verified){

      return {
        stored:false,
        reason:"VERIFICATION_REQUIRED"

      };

    }

    return this.remember({

      issue:data.issue,

      resolution:data.resolution,

      outcome:data.outcome,

      source:"AfriDebugKnowledgeReinforcement",

      verified:true

    });

  },


  health(){

    hydrate();

    return{
      service:"AfriDebugKnowledgeMemoryService",
      status:"healthy",
      cases:CaseMemory.count(),
      hydrated
    };

  }

};

export default AfriDebugKnowledgeMemoryService;
