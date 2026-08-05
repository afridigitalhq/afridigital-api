const CoreSubscriptionRegistry={
 register(plan,config={}){
  return {
   plan,
   config,
   status:"REGISTERED"
  };
 }
};

export default CoreSubscriptionRegistry;
