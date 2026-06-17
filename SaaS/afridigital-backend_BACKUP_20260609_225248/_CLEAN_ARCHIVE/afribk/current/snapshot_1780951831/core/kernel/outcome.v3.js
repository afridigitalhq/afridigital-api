function classifyOutcome(execution) {
  const isSystemFailure = execution?.flow === 'systemFlow';

  const isSuccess =
    execution?.ok === true &&
    !isSystemFailure;

  return {
    type: isSuccess ? 'success' : 'failure',
    retryable: !isSuccess,
    reason: isSystemFailure
      ? 'systemFlow block'
      : isSuccess
        ? 'ok'
        : 'execution failed'
  };
}

module.exports = { classifyOutcome };
