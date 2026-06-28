function addCluster(event) {
  return {
    ...event,
    cluster: event.service
  };
}

module.exports = { addCluster };
