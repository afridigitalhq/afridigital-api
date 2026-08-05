const CoreKnowledgeEngine={
 store(entry){
  return {entry,status:"STORED",createdAt:new Date().toISOString()};
 },
 retrieve(query){
  return {query,results:[],status:"SEARCHED"};
 }
};

export default CoreKnowledgeEngine;
