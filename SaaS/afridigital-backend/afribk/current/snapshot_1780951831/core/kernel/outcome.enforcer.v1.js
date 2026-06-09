function enforceOutcome(result) {
  const isSuccess = result?.ok === true && result?.flow !== 'systemFlow';

  return {
    ok: isSuccess,
    flow: result?.flow,
    result,
    outcome: {
      type: isSuccess ? 'success' : 'failure',
      retryable: !isSuccess
    }
  };
}

module.exports = { enforceOutcome };
