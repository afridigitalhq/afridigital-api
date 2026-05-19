const { assertApiVersion } = require("../runtime/safety/api.guard");
exports.routeIntent = (text = "") => {
  const t = text.toLowerCase();

  if (t.includes("hello")) return "greet";
  if (t.includes("price")) return "pricing";
  if (t.includes("buy")) return "sales";
  if (t.includes("help")) return "support";

  return "default";
};
