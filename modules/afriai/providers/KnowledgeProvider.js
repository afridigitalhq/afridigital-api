import AfriAIKnowledgeRetriever from "../knowledge-engine/AfriAIKnowledgeRetriever.js";

const KnowledgeProvider = {

  name:"knowledge",

  async generate(prompt=""){

    const userMessage =
      prompt.split("User:").pop()?.trim() || prompt;

    const knowledge =
      AfriAIKnowledgeRetriever.retrieve(userMessage);


    return JSON.stringify({

      provider:"knowledge",

      answer:
        knowledge.platform?.description ||
        "AfriDigital knowledge response ready.",

      sources:[
        "AfriPlatformKnowledge",
        "ProductKnowledge"
      ],

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
