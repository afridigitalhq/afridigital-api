export function AfriAIResponseContract({
  reply = "",
  suggestions = [],
  actions = [],
  metadata = {}
} = {}){

  return {
    reply,

    suggestions: suggestions.map(card => ({
      id: card.id || "",
      type: card.type || "product",
      title: card.title || card.id || "",
      description: card.description || "",
      status: card.status || "",
      availability: card.availability || "",
      action: card.action || "",
      route: card.route || ""
    })),

    actions,

    metadata: {
      source: "AfriAI",
      version: "1.0",
      ...metadata
    }
  };

}

export default AfriAIResponseContract;
