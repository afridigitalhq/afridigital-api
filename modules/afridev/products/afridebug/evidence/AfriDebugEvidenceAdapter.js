import CoreEvidenceVault from "../../../../core/evidence/CoreEvidenceVault.js";
import CoreSnapshotEngine from "../../../../core/evidence/CoreSnapshotEngine.js";
import CoreComparisonEngine from "../../../../core/evidence/CoreComparisonEngine.js";

const AfriDebugEvidenceAdapter={
 snapshot(target){
  return CoreSnapshotEngine.create(target);
 },
 store(item){
  return CoreEvidenceVault.store({service:"AfriDebug",...item});
 },
 compare(before,after){
  return CoreComparisonEngine.compare(before,after);
 }
};

export default AfriDebugEvidenceAdapter;
