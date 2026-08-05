const CoreEvidenceVault={
 store(item){
  return {item,status:"STORED",createdAt:new Date().toISOString()};
 },
 retrieve(id){
  return {id,status:"RETRIEVED"};
 }
};

export default CoreEvidenceVault;
