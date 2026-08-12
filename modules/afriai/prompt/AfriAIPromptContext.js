const AfriAIPromptContext = {

  build(knowledge = {}){

    if(!knowledge || typeof knowledge !== "object"){
      return {
        grounded:false,
        type:"KNOWLEDGE_NOT_FOUND"
      };
    }

    const context = {
      grounded:knowledge.grounded === true
    };

    if(knowledge.platform){
      context.platform = knowledge.platform;
    }

    if(knowledge.products){
      context.products = knowledge.products;
    }

    if(knowledge.payments){
      context.payments = knowledge.payments;
    }

    if(knowledge.opportunities){
      context.opportunities = knowledge.opportunities;
    }

    if(knowledge.studio){
      context.studio = knowledge.studio;
    }

    if(knowledge.status){
      context.status = knowledge.status;
    }

    if(knowledge.roadmap){
      context.roadmap = knowledge.roadmap;
    }

    return context;
  }

};

export default AfriAIPromptContext;
