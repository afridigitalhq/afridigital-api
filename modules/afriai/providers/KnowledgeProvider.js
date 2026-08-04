import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";

const KnowledgeProvider = {
  name:"knowledge",

  async generate(prompt=""){

    const userMessage =
      prompt.split("User:").pop()?.trim() || prompt;

    const knowledge =
      AfriAIKnowledgeRetriever.retrieve(userMessage);

    let answer =
      "AfriDigital knowledge response ready.";

    let sources = [];

    if(knowledge.platform){
      answer = knowledge.platform.description;
      sources.push("AfriPlatformKnowledge");
    }

    if(knowledge.products){
      const products = Object.keys(
        knowledge.products
      );

      const matched =
        products.find(p =>
          userMessage.toLowerCase()
          .includes(p.toLowerCase())
        );

      if(matched){
        const product =
          knowledge.products[matched];

        answer =
          `${matched} is ${product.description || "part of the AfriDigital ecosystem"}. Current status: ${product.status || "Under Development"}.`;

      } else {
        answer =
          "AfriDigital products include " +
          products.join(", ") + ".";
      }

      sources.push("ProductKnowledge");
    }

    console.log("🛠 AFRIDEBUG KNOWLEDGE:", JSON.stringify(Object.keys(knowledge)));

    if(knowledge.studio){
      answer =
        knowledge.studio.description;

      sources.push("StudioKnowledge");
    }

    if(knowledge.payments){
      answer =
        `${knowledge.payments.description || "AfriDigital payment services information available."}`;

      sources.push("PaymentsKnowledge");
    }

    if(knowledge.opportunities){
      answer =
        `${knowledge.opportunities.description || "AfriDigital opportunities information available."}`;

      sources.push("OpportunitiesKnowledge");
    }

    if(knowledge.status || knowledge.roadmap){
      answer =
        "AfriDigital development status and roadmap information available.";

      sources.push(
        "StatusKnowledge",
        "RoadmapKnowledge"
      );
    }

    console.log("🛠 AFRIDEBUG FINAL ANSWER:", answer);

    return JSON.stringify({

      provider:"knowledge",

      answer,

      sources,

      confidence:"HIGH",

      executionPath:[
        "KnowledgeRetriever",
        "KnowledgeProvider"
      ],

      status:"READY",

      knowledge

    },null,2);

  }

};

export default KnowledgeProvider;
