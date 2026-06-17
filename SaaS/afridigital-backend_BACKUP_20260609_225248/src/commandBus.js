const { execute } = require("./governor/executionGovernor");
const { process } = require("./brain");

const commandBus = {
  init() {
    console.log("📡 COMMAND BUS + BRAIN ONLINE");
  },

  async execute(input) {
    const { intent } = await process(input);

    return await execute(
      {
        type: intent.type,
        scope: intent.scope || "user",
        source: "brain-layer"
      },
      { role: "user" }
    );
  }
};

module.exports = { commandBus };
