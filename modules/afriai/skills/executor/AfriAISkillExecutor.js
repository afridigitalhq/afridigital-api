import AfriAIOpportunityEngine from "../../business/opportunities/AfriAIOpportunityEngine.js";

const AfriAISkillExecutor = {

  run(skill="conversation",data={}){

    if(skill === "opportunity"){
      return AfriAIOpportunityEngine.search(data);
    }

    return {
      skill,
      data,
      status:"EXECUTED"
    };

  }

};

export default AfriAISkillExecutor;
