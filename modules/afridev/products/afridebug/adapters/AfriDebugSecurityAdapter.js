import CoreSecurityScanner from "../../../../core/security/CoreSecurityScanner.js";
import CoreDependencyScanner from "../../../../core/security/CoreDependencyScanner.js";
import CoreSecretScanner from "../../../../core/security/CoreSecretScanner.js";
import CoreSecurityValidator from "../../../../core/security/CoreSecurityValidator.js";

const AfriDebugSecurityAdapter={
 scan(target){
  return CoreSecurityScanner.scan(target);
 },
 dependencies(items=[]){
  return CoreDependencyScanner.scan(items);
 },
 secrets(files=[]){
  return CoreSecretScanner.scan(files);
 },
 validate(result){
  return CoreSecurityValidator.validate(result);
 }
};

export default AfriDebugSecurityAdapter;
