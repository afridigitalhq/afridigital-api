import AfriVerifiedService from "../services/AfriVerifiedService.js";

const AfriVerifiedController = {
  getStatus(req){
    return AfriVerifiedService.getVerificationStatus(req.userId);
  }
};

export default AfriVerifiedController;
