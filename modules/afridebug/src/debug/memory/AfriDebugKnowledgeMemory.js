import CaseMemory from "./AfriDebugCaseMemory.js";
import Matcher from "./AfriDebugPatternMatcher.js";
import Store from "../knowledge/AfriDebugKnowledgeStore.js";

const AfriDebugKnowledgeMemory = {

  remember(data){

    const record = CaseMemory.store(data);

    Store.save(record);

    return record;

  },


  search(issue){

    return Matcher.match(
      issue,
      CaseMemory.list()
    );

  },


  health(){

    return{
      service:"AfriDebugKnowledgeMemory",
      status:"healthy",
      cases:CaseMemory.count()
    };

  }

};

export default AfriDebugKnowledgeMemory;
