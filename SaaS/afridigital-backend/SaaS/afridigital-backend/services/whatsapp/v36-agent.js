const { assertApiVersion } = require("../runtime/safety/api.guard");
const ai =
require("./engine");

const voice =
require("../voice/engine");

const realtime =
require("../realtime/agent");

module.exports = {

  async handle(payload={}){

    let text =
      payload.message || "";

    if(payload.type === "voice"){

      const voiceResult =
        await voice.transcribe(payload);

      text = voiceResult.text;
    }

    const routing =
      await realtime.route({
        userId: payload.from,
        message: text
      });

    const result =
      await ai.process({
        from: payload.from,
        message: text
      });

    return {

      ok: true,

      realtime: routing,

      ai: result,

      cards: [
        {
          type: "action",
          label: "Open Dashboard"
        },
        {
          type: "wallet",
          label: "Wallet"
        },
        {
          type: "earning",
          label: "Earn Money"
        }
      ]
    };
  }
};
