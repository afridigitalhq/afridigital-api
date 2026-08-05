const CoreEvidenceEngine={
 collect(type,payload={}){
  return {
   id:"EVD-"+Date.now(),
   type,
   payload,
   status:"COLLECTED",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreEvidenceEngine;
