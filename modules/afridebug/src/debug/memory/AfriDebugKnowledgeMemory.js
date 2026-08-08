import CaseMemory from "./AfriDebugCaseMemory.js";
import Matcher from "./AfriDebugPatternMatcher.js";
import Store from "../knowledge/AfriDebugKnowledgeStore.js";
import Persistence from "../knowledge/AfriDebugKnowledgePersistence.js";

let hydrated = false;

function hydrate(){

  if(hydrated) return;

  const records = Persistence.load();

  records.forEach(record => {
    CaseMemory.store(record);
  });

  hydrated = true;
}

const AfriDebugKnowledgeMemory = {

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


  health(){

    hydrate();

    return{
      service:"AfriDebugKnowledgeMemory",
      status:"healthy",
      cases:CaseMemory.count(),
      hydrated
    };

  }

};

export default AfriDebugKnowledgeMemory;
