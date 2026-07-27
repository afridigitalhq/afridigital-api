import AfriTrustService from "../services/AfriTrustService.js";

const AfriTrustController = {
  getProfile(req){
    return AfriTrustService.getPublicTrustProfile(req.userId);
  }
};

export default AfriTrustController;
