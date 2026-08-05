import CoreWorkspaceEngine from "../../../../core/workspace/CoreWorkspaceEngine.js";
import CoreWorkspaceManager from "../../../../core/workspace/CoreWorkspaceManager.js";

const AfriDebugWorkspaceAdapter={
 create(owner,context={}){
  return CoreWorkspaceEngine.create(owner,{service:"AfriDebug",...context});
 },
 access(workspace,user){
  return CoreWorkspaceManager.access(workspace,user);
 }
};

export default AfriDebugWorkspaceAdapter;
