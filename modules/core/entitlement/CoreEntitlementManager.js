const CoreEntitlementManager={
 assign(account,plan){
  return {account,plan,status:"ASSIGNED"};
 }
};

export default CoreEntitlementManager;
