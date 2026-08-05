const CoreEntitlementRegistry={
 register(plan,rules){
  return {plan,rules,status:"REGISTERED"};
 }
};

export default CoreEntitlementRegistry;
