import CoreArtifactManager from "../../../../core/artifacts/CoreArtifactManager.js";
import CoreArtifactBuilder from "../../../../core/artifacts/CoreArtifactBuilder.js";

const AfriDebugArtifactManager={
 create(type,data={}){
  return CoreArtifactManager.create(type,{service:"AfriDebug",...data});
 },
 package(items=[]){
  return CoreArtifactBuilder.build(items);
 }
};

export default AfriDebugArtifactManager;
