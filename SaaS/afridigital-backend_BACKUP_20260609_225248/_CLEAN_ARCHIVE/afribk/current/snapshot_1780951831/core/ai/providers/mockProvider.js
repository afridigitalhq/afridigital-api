async function generate(input) {
  const text = typeof input === "string" ? input : input?.text || "";
  return {
    text: "[MOCK]" + text.replace(/\s/g, "")
  };
}

module.exports = { generate };
