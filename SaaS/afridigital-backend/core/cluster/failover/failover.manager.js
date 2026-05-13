class FailoverManager {
  electReplica(nodes = []) {
    const online = nodes.filter(n => n.status === "ONLINE");

    if (!online.length) {
      return null;
    }

    return online[0];
  }
}

module.exports = new FailoverManager();
