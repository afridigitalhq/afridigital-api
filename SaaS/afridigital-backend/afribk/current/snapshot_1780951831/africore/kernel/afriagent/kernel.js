async function afriagentKernel(event, ctx) {
  const input = {
    user: event.user || event.from,
    text: event.text || event.message || "",
    source: event.source || "whatsapp"
  };

  const plan = await ctx.planner.buildPlan(input);

  const result = await ctx.executor.execute(plan, input);

  return result;
}

module.exports = { afriagentKernel };
