import AfriWebMessageProcessor from "../processors/AfriWebMessageProcessor.js";

const AfriWebAIRoute={

  async handle(request){
    return await AfriWebMessageProcessor.process(request.message);
  }

};

export default AfriWebAIRoute;
