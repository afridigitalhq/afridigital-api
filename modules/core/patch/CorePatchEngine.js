const CorePatchEngine={
 apply(target={},patch={}){
  return {
   target,
   patch,
   status:"PATCH_APPLIED",
   appliedAt:new Date().toISOString()
  };
 }
};

export default CorePatchEngine;
