function shard(userId, partitions = 4) {
  let hash = 0;

  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }

  return hash % partitions;
}

module.exports = { shard };
