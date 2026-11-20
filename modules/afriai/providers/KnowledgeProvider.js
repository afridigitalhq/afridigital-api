import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";
import CoreTraceEngine from "../../core/trace/CoreTraceEngine.js";

const KnowledgeProvider = {
  name: "knowledge",

  async generate(prompt = "") {
    const userMessage = prompt.split("User:").pop()?.split("\nAfriAI:")[0]?.trim() || prompt.trim();
    const knowledge = AfriAIKnowledgeRetriever.retrieve(userMessage);

    if (knowledge.grounded !== true) {
      CoreTraceEngine.event("PROVIDER_RESPONSE", {
        provider: "knowledge",
        status: "NOT_GROUNDED",
        sources: []
      });

      return JSON.stringify({
        provider: "knowledge",
        answer: null,
        sources: [],
        confidence: "LOW",
        executionPath: ["KnowledgeRetriever", "KnowledgeProvider"],
        status: "NOT_GROUNDED",
        grounded: false,
        error: "KNOWLEDGE_NOT_FOUND",
        knowledge
      });
    }

    let answer = "";
    const sources = [];
    const asksForPlatform = /\b(afridigital|afri digital|platform|ecosystem)\b/i.test(userMessage);
    const asksForProduct = /\b(product|products|name one|name a|give me one|example)\b/i.test(userMessage);

    const platformDescription =
      knowledge.platform?.platform?.description ||
      knowledge.platform?.description;

    if (platformDescription) {
      answer = platformDescription;
      sources.push("AfriPlatformKnowledge");
    }

    if (knowledge.products) {
      const products = Object.keys(knowledge.products);
      const matched = products.find(product =>
        userMessage.toLowerCase().includes(product.toLowerCase())
      );

      if (matched) {
        const product = knowledge.products[matched];
        answer = `${matched} is ${product.description || "part of the AfriDigital ecosystem"}. Current status: ${product.status || "Under Development"}.`;
      } else if (asksForProduct && products.length > 0) {
        const productName = products[0];
        const product = knowledge.products[productName];
        const productDescription = product.description || "part of the AfriDigital ecosystem";
        answer = asksForPlatform && platformDescription
          ? `${platformDescription} One product is ${productName}: ${productDescription}`
          : `One AfriDigital product is ${productName}: ${productDescription}`;
      } else if (!answer) {
        answer = `AfriDigital products include ${products.join(", ")}.`;
      }

      sources.push("ProductKnowledge");
    }

    if (knowledge.studio) {
      answer = knowledge.studio.description;
      sources.push("StudioKnowledge");
    }

    if (knowledge.payments) {
      answer = knowledge.payments.description ||
        "AfriDigital payment services information available.";
      sources.push("PaymentsKnowledge");
    }

    if (knowledge.opportunities) {
      answer = knowledge.opportunities.description ||
        "AfriDigital opportunities information available.";
      sources.push("OpportunitiesKnowledge");
    }

    if (knowledge.status || knowledge.roadmap) {
      answer = "AfriDigital development status and roadmap information available.";
      sources.push("StatusKnowledge", "RoadmapKnowledge");
    }

    if (!answer) {
      return JSON.stringify({
        provider: "knowledge",
        answer: null,
        sources,
        confidence: "LOW",
        executionPath: ["KnowledgeRetriever", "KnowledgeProvider"],
        status: "NOT_GROUNDED",
        grounded: false,
        error: "KNOWLEDGE_CONTENT_UNAVAILABLE",
        knowledge
      });
    }

    CoreTraceEngine.event("PROVIDER_RESPONSE", {
      provider: "knowledge",
      sources
    });

    return JSON.stringify({
      provider: "knowledge",
      answer,
      sources: [...new Set(sources)],
      confidence: "HIGH",
      executionPath: ["KnowledgeRetriever", "KnowledgeProvider"],
      status: "READY",
      grounded: true,
      knowledge
    }, null, 2);
  }
};

export default KnowledgeProvider;
