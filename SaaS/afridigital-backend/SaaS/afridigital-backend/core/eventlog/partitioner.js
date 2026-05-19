function getPartition(key, partitions = 6) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % partitions;
  }
  return hash;
}

function routeEvent(event) {
  const key = event.payload?.userId || event.payload?.user || "global";
  return {
    ...event,
    partition: getPartition(String(key))
  };
}

module.exports = { getPartition, routeEvent };
