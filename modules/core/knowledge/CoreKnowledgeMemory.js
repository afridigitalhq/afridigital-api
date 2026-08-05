const CoreKnowledgeMemory={
 remember(item){
  return {item,status:"REMEMBERED"};
 },
 recall(query){
  return {query,memory:[],status:"RECALLED"};
 }
};

export default CoreKnowledgeMemory;
