import AfriAIAfriDesignBridge from "../../integrations/afridesign/AfriAIAfriDesignBridge.js";

const AfriAIAppBuilderSkill={

  name:"build_app",

  async execute(request={}){

    const prompt = request.prompt || request.message || "";
    const versionMatch = String(request.version || prompt).match(/\b\d+\.\d+\.\d+\b/);
    const version = request.version || (versionMatch ? versionMatch[0] : undefined);

    return await AfriAIAfriDesignBridge.buildApp({
      ...request,
      prompt,
      version,
      provider:request.provider
    });

  }

};

export default AfriAIAppBuilderSkill;
