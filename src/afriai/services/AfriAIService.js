import IntentRouter from "../router/IntentRouter.js";
import ConversationMemory from "../memory/ConversationMemory.js";
import afriAIRuntime from "../runtime/AfriAIRuntime.js";

export async function AfriAIService({
  message = "",
  sessionId = "landing"
}) {

  const memory = ConversationMemory(sessionId);

  memory.add({
    role: "user",
    content: message
  });

  const result = IntentRouter(message);

  let reply;

  if (result?.fallback) {
    reply = await afriAIRuntime.ask(message);
  } else {
    reply = result.reply;
  }

  memory.add({
    role: "assistant",
    content: reply
  });

  return {
    sessionId,
    reply,
    contextSize: memory.size()
  };
}

export default AfriAIService;
