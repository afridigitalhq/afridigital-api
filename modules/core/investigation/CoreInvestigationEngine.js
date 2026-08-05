const CoreInvestigationEngine={
 investigate(context={}){
  return {
   id:"INV-"+Date.now(),
   context,
   stages:[],
   status:"INVESTIGATION_STARTED",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreInvestigationEngine;
