const { assertApiVersion } = require("../runtime/safety/api.guard");
module.exports = {

  async transcribe(payload={}){

    console.log("🎤 Voice received");

    return {
      text:
        payload.mockText ||
        "voice message received",
      duration:
        payload.duration || 0
    };
  },

  async synthesize(text=""){

    console.log("🔊 Voice synthesis ready");

    return {
      voiceReply: true,
      text
    };
  }
};
