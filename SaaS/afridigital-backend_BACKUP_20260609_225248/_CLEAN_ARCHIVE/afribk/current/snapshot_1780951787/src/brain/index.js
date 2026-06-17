const { parse } = require("./intent/parser");
const { route } = require("./llm/router");
const { normalize } = require("./whatsapp/normalize");

async function process(input) {
  const msg = normalize(input);
  const intent = parse(msg.text);
  const finalIntent = await route(intent);

  return {
    message: msg,
    intent: finalIntent
  };
}

module.exports = { process };
