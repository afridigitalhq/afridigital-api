const CoreDiffEngine={
 compare(before={},after={}){
  return {
   before,
   after,
   changes:[],
   status:"DIFF_CREATED",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreDiffEngine;
