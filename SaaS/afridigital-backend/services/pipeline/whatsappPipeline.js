const aiRouter = require("../../modules/ai-engine/router");
const a2Core = require("../../modules/a2-core");
const { getRecentMemory, saveMemory } = require("../memory/chatMemory");

async function whatsappPipeline(context) {
  try {
    const { message, user, channel } = context;

    // 🧠 LOAD MEMORY CONTEXT
    const history = await getRecentMemory(user);

    // 🤖 AI CALL (memory-aware input)
    const aiResponse = await aiRouter({
      message,
      user,
      channel,
      history
    });

    // 🧱 A2 CORE WRAP (logging layer)
    const finalResponse = await a2Core({
      context,
      aiResponse
    });

    // 💾 SAVE MEMORY
    await saveMemory({
      phone: user,
      message,
      response: finalResponse
    });

    return finalResponse || "⚡ Processed successfully.";

  } catch (err) {
    console.error("Pipeline Error:", err);
    return "⚡ System temporarily unavailable.";
  }
}

module.exports = whatsappPipeline;
