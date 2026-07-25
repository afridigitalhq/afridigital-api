import IntentRouter from "../router/IntentRouter.js";
import ConversationMemory from "../memory/ConversationMemory.js";
import afriAIRuntime from "../runtime/AfriAIRuntime.js";
import ActionBuilder from "../responses/ActionBuilder.js";
import ResponseBuilder from "../responses/ResponseBuilder.js";
import SuggestionSelector from "../responses/SuggestionSelector.js";

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

  return ResponseBuilder({
    reply,
    suggestions: SuggestionSelector(message),
    actions: ActionBuilder(SuggestionSelector(message)),
    metadata: {
      sessionId,
      contextSize: memory.size()
    }
  });
}

export default AfriAIService;
