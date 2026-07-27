import AfriTickService from "../services/AfriTickService.js";

const AfriTickController = {
  getMembership(req){
    return AfriTickService.getMembership(req.userId);
  }
};

export default AfriTickController;
