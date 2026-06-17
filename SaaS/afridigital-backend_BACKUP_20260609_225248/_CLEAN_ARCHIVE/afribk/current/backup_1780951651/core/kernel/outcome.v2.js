function classifyOutcome({ flow, result }) {
  const failure =
    !result?.ok ||
    flow === 'systemFlow';

  return {
    type: failure ? 'failure' : 'success',
    reason: flow === 'systemFlow' ? 'system fallback' : 'ok',
    retryable: failure
  };
}

module.exports = { classifyOutcome };
