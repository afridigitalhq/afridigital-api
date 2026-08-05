const CoreBillingUsageRegistry={
 register(metric,config){
  return {
   metric,
   config,
   status:"REGISTERED"
  };
 }
};

export default CoreBillingUsageRegistry;
