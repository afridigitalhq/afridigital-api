class ConsumerGroup {
  constructor(log) {
    this.log = log;
    this.offset = 0;
  }

  poll(batchSize = 10) {
    const all = this.log.readAll();
    const batch = all.slice(this.offset, this.offset + batchSize);

    this.offset += batch.length;
    return batch;
  }

  reset() {
    this.offset = 0;
  }
}

module.exports = ConsumerGroup;
