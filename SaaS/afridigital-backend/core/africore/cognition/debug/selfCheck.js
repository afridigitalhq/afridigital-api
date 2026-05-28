module.exports = {
  analyze(result) {
    const issues = [];

    if (!result?.ai) issues.push("missing_ai_response");
    if (!result?.actions?.length) issues.push("no_tool_execution");
    if (result?.error) issues.push("runtime_error");

    return {
      healthy: issues.length === 0,
      issues
    };
  }
};
