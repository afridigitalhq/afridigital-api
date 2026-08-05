const CoreEvidenceRegistry={
 register(type,handler){
  return {type,handler,status:"REGISTERED"};
 }
};

export default CoreEvidenceRegistry;
