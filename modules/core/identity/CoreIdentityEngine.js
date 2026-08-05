const CoreIdentityEngine={
 create(profile={}){
  return {
   id:"USER-"+Date.now(),
   profile,
   status:"ACTIVE",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreIdentityEngine;
