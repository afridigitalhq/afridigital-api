const CoreArtifactEngine={
 build(type,payload={}){
  return {
   id:"ART-"+Date.now(),
   type,
   payload,
   createdAt:new Date().toISOString(),
   status:"BUILT"
  };
 }
};

export default CoreArtifactEngine;
