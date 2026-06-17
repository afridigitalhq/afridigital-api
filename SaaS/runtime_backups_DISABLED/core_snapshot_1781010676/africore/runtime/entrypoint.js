const kernel = require("./kernel");

/**
 * SINGLE ENTRY POINT FOR ALL WHATSAPP EVENTS
 * Everything must pass through here.
 */
module.exports = {
  async handle(event) {
    try {
      if (!event || !event.type) {
        return { ok: false, error: "invalid_event" };
      }

      // FORCE ALL EVENTS INTO KERNEL
      const result = await kernel.run({
        from: event.from,
        text: event.text,
        type: event.type,
        traceId: event.id || event.traceId
      });

      return result;
    } catch (e) {
      console.log("ENTRYPOINT ERROR:", e.message);
      return { ok: false, error: e.message };
    }
  }
};
