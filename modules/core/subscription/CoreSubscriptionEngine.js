const CoreSubscriptionEngine={
 activate(account,plan){
  return {
   account,
   plan,
   status:"ACTIVE",
   activatedAt:new Date().toISOString()
  };
 }
};

export default CoreSubscriptionEngine;
