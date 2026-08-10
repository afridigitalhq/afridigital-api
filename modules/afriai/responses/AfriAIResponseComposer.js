import ResponseBuilder from "./ResponseBuilder.js";
import SuggestionSelector from "./SuggestionSelector.js";
import ActionBuilder from "./ActionBuilder.js";

const AfriAIResponseComposer = {

  compose(result = {}){

    const rawResponse = result?.execution?.response;

    let response = rawResponse;

    if(typeof rawResponse === "string"){
      try{ response = JSON.parse(rawResponse); }catch{}
    }

    const reply =
      response?.reply ||
      (response?.status === "NO_PROVIDER_AVAILABLE"
        ? "AfriAI provider is currently unavailable."
        : "Hello 👋 I'm AfriAI. How can I help you today?");

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
        provider: response?.provider || null,
        status: response?.status || "AI_RESPONSE_READY"
      }
    });

  }

};

export default AfriAIResponseComposer;
