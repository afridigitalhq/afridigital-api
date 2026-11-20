import AfriAIKnowledgeRegistry from "./AfriAIKnowledgeRegistry.js";
import CoreTraceEngine from "../../core/trace/CoreTraceEngine.js";

const AfriAIKnowledgeRetriever = {
  retrieve(message = "") {
    const knowledge = AfriAIKnowledgeRegistry.load();
    const text = String(message).toLowerCase();
    const context = {};

    const mentionsPlatform = /\b(afridigital|afri digital|platform|ecosystem)\b/.test(text);
    const asksPlatform = mentionsPlatform &&
      /\b(what|about|describe|identify|explain|tell|platform|ecosystem)\b/.test(text);
    const matchedProduct = Object.keys(knowledge.products || {}).find(name => text.includes(name.toLowerCase()));
    const asksProducts = Boolean(matchedProduct) || /\b(product|products|commerce|shop|market|marketplace|catalog|catalogue|offerings)\b/.test(text);

    if (asksPlatform) {
      context.platform = knowledge.platform;
      context.products = knowledge.products;
    } else if (asksProducts) {
      context.products = knowledge.products;
    }

    if (/\b(pay|payment|payments|money|coin|wallet)\b/.test(text)) {
      context.payments = knowledge.payments;
    }

    if (/\b(earn|income|business|sell|work|job|jobs)\b/.test(text)) {
      context.opportunities = knowledge.opportunities;
    }

    if (/\b(studio|design)\b/.test(text)) {
      context.studio = knowledge.studio;
    }

    if (/\b(status|development|roadmap)\b/.test(text)) {
      context.status = knowledge.status;
      context.roadmap = knowledge.roadmap;
    }

    if (Object.keys(context).length === 0) {
      CoreTraceEngine.event("KNOWLEDGE_NOT_GROUNDED", { keys: [] });
      return { grounded: false, type: "KNOWLEDGE_NOT_FOUND" };
    }

    CoreTraceEngine.event("KNOWLEDGE_RETRIEVED", {
      keys: Object.keys(context)
    });

    return {
      grounded: true,
      ...context
    };
  }
};

export default AfriAIKnowledgeRetriever;
