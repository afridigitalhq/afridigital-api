import AfriAIKnowledgeRegistry from "../../knowledge-engine/AfriAIKnowledgeRegistry.js";
import AfriAIKnowledgeRetriever from "../../knowledge-engine/AfriAIKnowledgeRetriever.js";

const AfriAIKnowledgeRuntime = {

  registry(){
    return AfriAIKnowledgeRegistry.load();
  },

  retrieve(message="",context={}){

    return {
      source:"AfriAIKnowledgeRuntime",
      context,
      knowledge:AfriAIKnowledgeRetriever.retrieve(message)
    };

  },

  refresh(){

    return this.registry();

  },

  status(){

    return {
      status:"READY",
      governance:"ACTIVE"
    };

  }

};

export default AfriAIKnowledgeRuntime;
