import CoreEvidenceVault from "../../core/evidence/CoreEvidenceVault.js";

const AfriCTVCEvidenceAdapter={store(record){
 return CoreEvidenceVault.store(record);
}};

export default AfriCTVCEvidenceAdapter;
