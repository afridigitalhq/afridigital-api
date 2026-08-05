import CoreDiffEngine from "../../../../core/patch/CoreDiffEngine.js";
import CorePatchEngine from "../../../../core/patch/CorePatchEngine.js";
import CorePatchValidator from "../../../../core/patch/CorePatchValidator.js";
import CoreChangeTracker from "../../../../core/patch/CoreChangeTracker.js";

const AfriDebugPatchAdapter={
 diff(before,after){
  return CoreDiffEngine.compare(before,after);
 },
 apply(target,patch){
  return CorePatchEngine.apply(target,patch);
 },
 validate(result){
  return CorePatchValidator.validate(result);
 },
 track(change){
  return CoreChangeTracker.track({service:"AfriDebug",...change});
 }
};

export default AfriDebugPatchAdapter;
