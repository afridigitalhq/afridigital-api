import CoreDependencyGraph from "../../../../core/dependency/CoreDependencyGraph.js";

const AfriDebugDependencyAdapter={
 build(repository){
  return CoreDependencyGraph.build({
   service:"AfriDebug",
   repository
  });
 }
};

export default AfriDebugDependencyAdapter;
