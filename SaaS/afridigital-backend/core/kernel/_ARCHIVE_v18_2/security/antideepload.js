function detectDeepLoad(stack) {
  const depth = (stack.match(/require\\(/g) || []).length;
  if (depth > 50) {
    throw new Error("V18.2_DEEPLOAD_BLOCK: dependency explosion detected");
  }
}

module.exports = { detectDeepLoad };
