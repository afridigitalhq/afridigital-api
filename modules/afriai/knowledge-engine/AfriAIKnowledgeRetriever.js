import AfriAIKnowledgeRegistry from "./AfriAIKnowledgeRegistry.js";

const AfriAIKnowledgeRetriever = {

  retrieve(message = ""){

    const knowledge =
      AfriAIKnowledgeRegistry.load();

    const text =
      message.toLowerCase();

    const context = {};

    if(
      text.includes("commerce") ||
      text.includes("shop") ||
      text.includes("market")
    ){
      context.products = knowledge.products;
    }

    if(
      text.includes("pay") ||
      text.includes("money") ||
      text.includes("coin")
    ){
      context.payments = knowledge.payments;
    }

    if(
      text.includes("studio") ||
      text.includes("design")
    ){
      context.studio = knowledge.studio;
    }

    if(
      text.includes("status") ||
      text.includes("development") ||
      text.includes("roadmap")
    ){
      context.status = knowledge.status;
      context.roadmap = knowledge.roadmap;
    }

    if(Object.keys(context).length === 0){
      return knowledge.platform;
    }

    return context;

  }

};

export default AfriAIKnowledgeRetriever;
