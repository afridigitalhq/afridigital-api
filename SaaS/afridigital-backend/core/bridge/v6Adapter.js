const engineV6 = require("../../controllers/afriCommandEngineV6");

async function handleCommand(event, sender){
  try{
    if(!event || !event.body) return;

    // normalize input for V6
    const req = {
      body: {
        from: event.body.from || event.body.user || "unknown",
        text: event.body.text || event.body.message || ""
      }
    };

    return await engineV6.runCommand(req, sender);

  }catch(e){
    console.log("⚠️ V6 adapter error:", e.message);
  }
}

module.exports = { handleCommand };
