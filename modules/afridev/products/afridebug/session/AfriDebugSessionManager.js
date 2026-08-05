import CoreSessionManager from "../../../../core/session/CoreSessionManager.js";

const AfriDebugSessionManager={
 create(payload={}){
  return CoreSessionManager.create("AFRIDEBUG",payload);
 },
 update(session,changes={}){
  return CoreSessionManager.update(session,changes);
 },
 complete(session){
  return CoreSessionManager.complete(session);
 }
};

export default AfriDebugSessionManager;
