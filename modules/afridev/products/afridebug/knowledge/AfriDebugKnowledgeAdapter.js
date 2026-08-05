import CoreKnowledgeEngine from "../../../../core/knowledge/CoreKnowledgeEngine.js";

const AfriDebugKnowledgeAdapter={
 store(entry){
  return CoreKnowledgeEngine.store({service:"AfriDebug",...entry});
 },
 search(query){
  return CoreKnowledgeEngine.retrieve(query);
 }
};

export default AfriDebugKnowledgeAdapter;
