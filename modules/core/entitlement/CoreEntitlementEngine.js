const CoreEntitlementEngine={
 check(account,feature){
  return {
   account,
   feature,
   allowed:false,
   checkedAt:new Date().toISOString()
  };
 }
};

export default CoreEntitlementEngine;
