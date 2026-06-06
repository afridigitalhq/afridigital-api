export const layoutAI = {
  init() {},

  suggest(windowList) {
    return windowList.map((w, i) => ({
      id: w.id,
      suggestedX: 60 + (i * 30),
      suggestedY: 60 + (i * 30)
    }));
  }
};
