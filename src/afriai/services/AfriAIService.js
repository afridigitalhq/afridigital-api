import IntentRouter from "../router/IntentRouter.js";
import ConversationMemory from "../memory/ConversationMemory.js";

export function AfriAIService({ message = "", sessionId = "landing" }) {
  const memory = ConversationMemory(sessionId);

  memory.add({
    role: "user",
    content: message
  });

  const result = IntentRouter(message);

  memory.add({
    role: "assistant",
    content: result.reply
  });

  return {
    sessionId,
    reply: result.reply,
    contextSize: memory.size()
  };
}

export default AfriAIService;
