const CoreUsageEngine={
 consume(account,resource,amount=1){
  return {account,resource,amount,status:"USAGE_RECORDED",timestamp:new Date().toISOString()};
 }
};

export default CoreUsageEngine;
