import AfriAIKnowledgeRegistry from "./AfriAIKnowledgeRegistry.js";
import CoreTraceEngine from "../../core/trace/CoreTraceEngine.js";

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
      text.includes("earn") ||
      text.includes("income") ||
      text.includes("money") ||
      text.includes("business") ||
      text.includes("sell") ||
      text.includes("work")
    ){
      context.opportunities = knowledge.opportunities;
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

    if(
      text.includes("what products") ||
      text.includes("what is afridigital") ||
      text.includes("tell me about afridigital")
    ){
      context.platform = knowledge.platform;
      context.products = knowledge.products;
      context.payments = knowledge.payments;
    }

    if(Object.keys(context).length === 0){

      CoreTraceEngine.event(
        "KNOWLEDGE_NOT_GROUNDED",
        {
          keys:[]
        }
      );

      return {
        grounded:false,
        type:"KNOWLEDGE_NOT_FOUND"
      };
    }

    CoreTraceEngine.event(
      "KNOWLEDGE_RETRIEVED",
      {
        keys:Object.keys(context)
      }
    );

    return {
      grounded:true,
      ...context
    };

  }

};

export default AfriAIKnowledgeRetriever;
