const crypto = require("crypto");

class PartitionRouter {
  constructor(clusterSize = 3) {
    this.clusterSize = clusterSize;
  }

  getNode(userId) {
    const hash = crypto.createHash("sha256").update(userId).digest("hex");
    const num = parseInt(hash.substring(0, 8), 16);
    return num % this.clusterSize;
  }

  route(event) {
    const key = event.partitionKey || event.from;
    return this.getNode(key);
  }
}

module.exports = new PartitionRouter();
