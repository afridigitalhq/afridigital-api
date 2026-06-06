import { intentParser } from "../intentParser.js";
import { commandBus } from "../commandBus.js";
import { authContext } from "../auth/authContext.js";

export const aiController = {
  init() {},

  handleInput(input) {
    const intent = intentParser.parse(input);

    if (!intent || intent.type === "UNKNOWN") {
      return console.warn("❓ Unresolved intent:", input);
    }

    // attach role context
    const role = authContext.getRole();

    const command = {
      ...intent,
      meta: {
        role,
        source: "AI_CONTROLLER"
      }
    };

    return commandBus.execute(command);
  }
};
