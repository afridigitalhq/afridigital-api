import AfriAIResponseContract from "../contracts/AfriAIResponseContract.js";

import SuggestionRegistry from "./SuggestionRegistry.js";

export function ResponseBuilder({
  reply = "",
  suggestions = [],
  actions = [],
  metadata = {}
} = {}){

  return AfriAIResponseContract({
    reply,
    suggestions: suggestions.length ? suggestions : SuggestionRegistry.products,
    actions,
    metadata
  });

}

export default ResponseBuilder;
