import AfriPlatformKnowledge from "../../../src/afriai/knowledge/AfriPlatformKnowledge.js";
import ProductKnowledge from "../../../src/afriai/knowledge/ProductKnowledge.js";
import PaymentsKnowledge from "../../../src/afriai/knowledge/PaymentsKnowledge.js";
import RoadmapKnowledge from "../../../src/afriai/knowledge/RoadmapKnowledge.js";
import StatusKnowledge from "../../../src/afriai/knowledge/StatusKnowledge.js";
import StudioKnowledge from "../../../src/afriai/knowledge/StudioKnowledge.js";

const AfriAIKnowledgeRegistry = {

  load(){
    return {
      platform: AfriPlatformKnowledge,
      products: ProductKnowledge,
      payments: PaymentsKnowledge,
      roadmap: RoadmapKnowledge,
      status: StatusKnowledge,
      studio: StudioKnowledge
    };
  }

};

export default AfriAIKnowledgeRegistry;
