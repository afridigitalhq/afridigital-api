function checkHealth(system) {

  const issues = [];

  if (!system.kernel) issues.push('kernel_down');
  if (!system.orchestrator) issues.push('orchestrator_down');
  if (!system.eventBus) issues.push('eventbus_down');

  return {
    healthy: issues.length === 0,
    issues
  };
}

module.exports = {
  checkHealth
};
