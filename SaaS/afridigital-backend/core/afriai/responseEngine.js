function generateReply(input){
  const text = (input?.body || "").toLowerCase();

  // simple intent routing (fast intelligence layer)
  if(text?.includes("price") || text?.includes("cost")){
    return "💰 Let me check pricing details for you.";
  }

  if(text?.includes("hello") || text?.includes("hi")){
    return "👋 Hello! I'm AfriAI. How can I help you today?";
  }

  if(text?.includes("help")){
    return "🛠️ I'm here to help. Ask me anything about your request.";
  }

  if(text?.includes("order")){
    return "📦 I’ve received your order request. Processing now...";
  }

  // fallback intelligent response
  return "🧠 I understand your message. Let me process that for you.";
}

module.exports = { generateReply };
