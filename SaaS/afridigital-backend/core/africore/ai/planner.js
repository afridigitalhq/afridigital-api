module.exports = {
  plan(ai, event){

    const t = (event.text || "").toLowerCase();

    const steps = [];

    if(t?.includes("crash") || t?.includes("error")){
      steps.push({ tool: "check_logs", input: "system" });
      steps.push({ tool: "analyze_memory", input: "system" });
    }

    steps.push({
      tool: "send_message",
      input: event.user
    });

    return {
      intent: ai.category,
      goal: "resolve request",
      steps,
      final_response: ai.response
    };
  }
};
