class Lifecycle {
  async run(request, handler) {
    const ctx = {
      id: Date.now().toString(),
      state: "INIT",
      start: Date.now()
    };

    try {
      ctx.state = "ROUTE";
      const result = await handler(ctx);

      ctx.state = "COMMIT";
      ctx.end = Date.now();

      return result;
    } catch (e) {
      ctx.state = "FAILED";
      throw e;
    }
  }
}

module.exports = { Lifecycle };
