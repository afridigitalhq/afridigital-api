const CoreArtifactBuilder={
 build(items=[]){
  return {items,total:items.length,status:"BUILT"};
 }
};

export default CoreArtifactBuilder;
