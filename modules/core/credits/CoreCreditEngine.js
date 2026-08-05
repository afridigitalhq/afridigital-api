const CoreCreditEngine={
 charge(account,amount,reason=""){
  return {account,amount,reason,status:"CHARGED",timestamp:new Date().toISOString()};
 },
 refund(account,amount,reason=""){
  return {account,amount,reason,status:"REFUNDED",timestamp:new Date().toISOString()};
 }
};

export default CoreCreditEngine;
