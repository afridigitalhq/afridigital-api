const CoreStorageEngine={
 save(file,context={}){
  return {
   id:"FILE-"+Date.now(),
   file,
   context,
   status:"STORED",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreStorageEngine;
