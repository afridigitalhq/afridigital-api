import CoreStorageEngine from "../../../../core/storage/CoreStorageEngine.js";
import CoreStorageManager from "../../../../core/storage/CoreStorageManager.js";

const AfriDebugStorageAdapter={
 save(file,context={}){
  return CoreStorageEngine.save(file,{service:"AfriDebug",...context});
 },
 remove(id){
  return CoreStorageManager.remove(id);
 }
};

export default AfriDebugStorageAdapter;
