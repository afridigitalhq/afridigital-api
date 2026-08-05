const CorePayAsYouUseEngine={
 charge(account,usage={}){
  return {
   account,
   usage,
   type:"PAY_AS_YOU_USE",
   status:"BILLABLE",
   createdAt:new Date().toISOString()
  };
 }
};

export default CorePayAsYouUseEngine;
