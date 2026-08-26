import AfriDesignBuildQueue from "../../../afridesign/jobs/AfriDesignBuildQueue.js";

const AfriAIAfriDesignBridge={

  async buildApp(request={}){

    return await AfriDesignBuildQueue.submit({
      ...request,
      type:request.type || request.buildType || "app_builder",
      prompt:request.prompt || ""
    });

  }

};

export default AfriAIAfriDesignBridge;
