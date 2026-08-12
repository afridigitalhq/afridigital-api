import AfriAIAfriDesignBridge from "../../integrations/afridesign/AfriAIAfriDesignBridge.js";

const AfriAIAppBuilderSkill={

name:"build_app",

execute(request={}){

 return AfriAIAfriDesignBridge.buildApp({
  prompt:request.prompt,
  provider:request.provider || "appdeploy"
 });

}

};

export default AfriAIAppBuilderSkill;
