class Partitioner {
  getPartition(key, partitions = 3) {
    if (!key) return 0;
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }

    return hash % partitions;
  }
}

module.exports = new Partitioner();
