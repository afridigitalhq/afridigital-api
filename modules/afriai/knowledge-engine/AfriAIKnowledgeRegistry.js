import AfriPlatformKnowledge from "../knowledge/AfriPlatformKnowledge.js";
import ProductKnowledge from "../knowledge/ProductKnowledge.js";
import PaymentsKnowledge from "../knowledge/PaymentsKnowledge.js";
import RoadmapKnowledge from "../knowledge/RoadmapKnowledge.js";
import StatusKnowledge from "../knowledge/StatusKnowledge.js";
import StudioKnowledge from "../knowledge/StudioKnowledge.js";
import OpportunitiesKnowledge from "../knowledge/OpportunitiesKnowledge.js";

const AfriAIKnowledgeRegistry = {

  load(){
    return {
      platform: AfriPlatformKnowledge,
      products: ProductKnowledge,
      payments: PaymentsKnowledge,
      roadmap: RoadmapKnowledge,
      status: StatusKnowledge,
      studio: StudioKnowledge,
      opportunities: OpportunitiesKnowledge
    };
  }

};

export default AfriAIKnowledgeRegistry;
