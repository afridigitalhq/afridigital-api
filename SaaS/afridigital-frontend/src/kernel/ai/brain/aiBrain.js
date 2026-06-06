import { layoutAI } from "../layoutAI.js";
import { predictor } from "../predictor.js";
import { aiGuard } from "../guard/aiGuard.js";

export const aiBrain = {
  init() {
    layoutAI.init();
    predictor.init();
    aiGuard.init();
  },

  requestLayoutOptimization() {
    aiGuard.init();
  }
};
