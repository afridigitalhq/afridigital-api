function classifyOutcome({ flow, result }) {
  const success = result?.ok === true && flow !== 'systemFlow';

  return {
    type: success ? 'success' : 'failure',
    retryable: !success,
    reason: flow === 'systemFlow'
      ? 'system_block'
      : success
        ? 'ok'
        : 'execution_failed'
  };
}

module.exports = { classifyOutcome };
