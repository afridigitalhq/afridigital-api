module.exports = {
  async think(event){
    const text = (event.text || "").toLowerCase();

    const category =
      text.includes("crash") ? "devops" :
      text.includes("error") ? "support" :
      text.includes("buy") ? "commerce" :
      "general";

    return {
      category,
      response: `Processed: ${event.text}`,
      confidence: 0.6,
      actions: []
    };
  }
};
