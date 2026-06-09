function parse(input) {
  const text = (input?.text || input || "").toLowerCase();

  if (text.includes("user") && text.includes("list")) {
    return { type: "GET_USERS", scope: "admin" };
  }

  if (text.includes("log")) {
    return { type: "GET_LOGS", scope: "admin" };
  }

  if (text.includes("help")) {
    return { type: "HELP", scope: "public" };
  }

  return { type: "UNKNOWN", raw: text };
}

module.exports = { parse };
