const AfriA2AResponse = {

  success({
    taskId,
    capability,
    agentId,
    result = null,
    usage = null
  } = {}) {

    return {
      ok: true,
      taskId: taskId || null,
      capability: capability || null,
      agentId: agentId || null,
      result,
      usage,
      completedAt: Date.now()
    };

  },

  error({
    taskId = null,
    code = "A2A_ERROR",
    message = "A2A request failed",
    details = null
  } = {}) {

    return {
      ok: false,
      taskId,
      error: {
        code,
        message,
        details
      },
      failedAt: Date.now()
    };

  }

};

export default AfriA2AResponse;
