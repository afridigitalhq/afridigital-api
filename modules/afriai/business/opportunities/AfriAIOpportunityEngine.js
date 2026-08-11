import AfriAIServiceConnector from "../../connectors/AfriAIServiceConnector.js";

const AfriAIOpportunityEngine = {

  search(data={}){

    const serviceRequest =
      AfriAIServiceConnector.connect(
        "JOB_SEARCH",
        data
      );

    return {
      capability:"opportunity",
      action:"search",
      serviceRequest,
      status:"SERVICE_REQUEST_READY"
    };

  }

};

export default AfriAIOpportunityEngine;
