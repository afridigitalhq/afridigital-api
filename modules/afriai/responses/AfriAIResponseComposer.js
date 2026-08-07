import ResponseBuilder from "./ResponseBuilder.js";
import SuggestionSelector from "./SuggestionSelector.js";
import ActionBuilder from "./ActionBuilder.js";

const AfriAIResponseComposer = {

  compose(result = {}){

    const reply =
      result?.execution?.response?.answer ||
      result?.execution?.response?.response ||
      result?.execution?.response ||
      "Hello 👋 I'm AfriAI. How can I help you today?";

    const normalizedReply =
      typeof reply === "string"
        ? reply
        : JSON.stringify(reply);

    const suggestions =
      SuggestionSelector(
        normalizedReply
      );

    const actions =
      ActionBuilder(
        suggestions
      );

    return ResponseBuilder({
      reply: normalizedReply,
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
