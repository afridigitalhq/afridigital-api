const AfriAIKnowledgeProjection = {

  project(message = "", knowledge = {}){

    const text = message.toLowerCase().trim();

    if(!knowledge || typeof knowledge !== "object"){
      return {
        grounded:false,
        type:"KNOWLEDGE_NOT_FOUND"
      };
    }

    const projected = {
      grounded:knowledge.grounded === true
    };

    const wantsPlatform =
      text.includes("what is afridigital") ||
      text.includes("tell me about afridigital") ||
      text.includes("about afridigital");

    const wantsCommerce =
      text.includes("africommerce") ||
      text.includes("afri commerce");

    const wantsPayments =
      text.includes("payment") ||
      text.includes("pay") ||
      text.includes("money") ||
      text.includes("coin") ||
      text.includes("wallet");

    const wantsOpportunities =
      text.includes("earn") ||
      text.includes("income") ||
      text.includes("business") ||
      text.includes("sell") ||
      text.includes("work") ||
      text.includes("job");

    const wantsStudio =
      text.includes("studio") ||
      text.includes("design");

    const wantsStatus =
      text.includes("status") ||
      text.includes("development") ||
      text.includes("roadmap");

    if(wantsPlatform && knowledge.platform){
      projected.platform = {
        platform:knowledge.platform.platform,
        intelligence:knowledge.platform.intelligence,
        payments:knowledge.platform.payments
      };
    }

    if(wantsCommerce && knowledge.products?.AfriCommerce){
      projected.products = {
        AfriCommerce:knowledge.products.AfriCommerce
      };
    }

    if(wantsPayments && knowledge.payments){
      projected.payments = knowledge.payments;
    }

    if(wantsOpportunities && knowledge.opportunities){
      projected.opportunities = knowledge.opportunities;
    }

    if(wantsStudio && knowledge.studio){
      projected.studio = knowledge.studio;
    }

    if(wantsStatus && knowledge.status){
      projected.status = knowledge.status;
    }

    if(wantsStatus && knowledge.roadmap){
      projected.roadmap = knowledge.roadmap;
    }

    if(Object.keys(projected).length === 1){

      return {
        grounded:false,
        type:"KNOWLEDGE_NOT_FOUND"
      };

    }

    return projected;
  }

};

export default AfriAIKnowledgeProjection;
