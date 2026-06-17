function review(result) {
  if (!result) {
    return { ok: false, text: "No result produced" };
  }

  if (result.error) {
    return {
      ok: false,
      text: `Tool failed: ${result.error}`
    };
  }

  return {
    ok: true,
    text: typeof result.result === "string"
      ? result.result
      : JSON.stringify(result.result)
  };
}

module.exports = { review };
