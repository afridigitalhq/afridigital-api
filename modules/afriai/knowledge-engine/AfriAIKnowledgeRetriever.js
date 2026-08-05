import AfriAIKnowledgeRegistry from "./AfriAIKnowledgeRegistry.js";
import AfriDebugRuntime from "../../platform/observability/debug/AfriDebugRuntime.js";

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

    if(Object.keys(context).length === 0){

      const fallback = knowledge.platform;

      AfriDebugRuntime.event(
        "KNOWLEDGE_RETRIEVED",
        {
          keys:["platform"]
        }
      );

      return fallback;
    }

    AfriDebugRuntime.event(
      "KNOWLEDGE_RETRIEVED",
      {
        keys:Object.keys(context)
      }
    );

    return context;

  }

};

export default AfriAIKnowledgeRetriever;
