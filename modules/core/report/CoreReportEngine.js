const CoreReportEngine={
 generate(type,data={}){
  return {
   id:"RPT-"+Date.now(),
   type,
   data,
   generatedAt:new Date().toISOString(),
   status:"GENERATED"
  };
 }
};

export default CoreReportEngine;
