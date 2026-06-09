module.exports = {
  name: "send_message",

  async run(payload, ctx){
    return {
      ok: true,
      delivered: true,
      to: payload.to,
      text: payload.text,
      traceId: ctx?.traceId
    };
  }
};
