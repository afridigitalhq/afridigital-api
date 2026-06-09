function shouldRetry(toolResult) {
  if (!toolResult) {
    return false;
  }

  // retry failed execution
  if (toolResult.ok === false) {
    return true;
  }

  return false;
}

function chooseFallbackTool(toolName) {
  const fallbackMap = {
    pricingTool: 'echoTool',
    supportTool: 'echoTool'
  };

  return fallbackMap[toolName] || null;
}

module.exports = {
  shouldRetry,
  chooseFallbackTool
};
