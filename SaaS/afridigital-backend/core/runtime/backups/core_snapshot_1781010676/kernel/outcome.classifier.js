function classifyOutcome({ flow, result = {} }) {

  const successFlows = ['greetingFlow'];

  const isSuccess =
    successFlows.includes(flow) &&
    result?.ok === true;

  const isSystemFallback =
    flow === 'systemFlow';

  let type = 'success';

  if (!isSuccess || isSystemFallback) {
    type = 'failure';
  }

  return {
    type,
    replay: type === 'failure',
    reason: isSystemFallback
      ? 'systemFlow fallback detected'
      : !isSuccess
        ? 'flow did not meet success criteria'
        : 'ok'
  };
}

module.exports = { classifyOutcome };
