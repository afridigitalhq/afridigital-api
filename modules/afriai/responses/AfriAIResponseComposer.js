import ResponseBuilder from "./ResponseBuilder.js";
import SuggestionSelector from "./SuggestionSelector.js";
import ActionBuilder from "./ActionBuilder.js";

const AfriAIResponseComposer = {

  compose(result = {}){

    const reply =
      result?.execution?.response ||
      "Hello 👋 I'm AfriAI. How can I help you today?";

    const suggestions =
      SuggestionSelector(
        reply
      );

    const actions =
      ActionBuilder(
        suggestions
      );

    return ResponseBuilder({
      reply,
      suggestions,
      actions,
      metadata:{
        intent: result?.intent || "unknown",
        status: "AI_RESPONSE_READY"
      }
    });

  }

};

export default AfriAIResponseComposer;
