import { commandBus } from "../../commandBus.js";

export const uiGuard = {
  init() {},

  dispatch(action) {
    if (!action || !action.type) {
      console.warn("❌ UI BLOCKED: invalid action");
      return;
    }

    // HARD RULE: UI cannot mutate state directly
    return commandBus.execute({
      ...action,
      meta: {
        source: "UI_GUARD",
        locked: true
      }
    });
  }
};
