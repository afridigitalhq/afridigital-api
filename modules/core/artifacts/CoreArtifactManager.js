const CoreArtifactManager={
 create(type,data={}){
  return {type,data,status:"CREATED",createdAt:new Date().toISOString()};
 },
 remove(id){
  return {id,status:"REMOVED"};
 }
};

export default CoreArtifactManager;
