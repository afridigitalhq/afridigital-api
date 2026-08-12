import AfriAIOpportunityEngine from "../../business/opportunities/AfriAIOpportunityEngine.js";
import AfriAIAppBuilderSkill from "../builders/AfriAIAppBuilderSkill.js";

const AfriAISkillExecutor = {

  async run(skill="conversation",data={}){

    if(skill === "opportunity"){
      return AfriAIOpportunityEngine.search(data);
    }

    if(skill === "build_app"){
      return await AfriAIAppBuilderSkill.execute(data);
    }

    return {
      skill,
      data,
      status:"EXECUTED"
    };

  }

};

export default AfriAISkillExecutor;
