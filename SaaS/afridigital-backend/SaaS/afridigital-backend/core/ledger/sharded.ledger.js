
// SHARDED LEDGER ROUTER
function getShard(accountId) {
  const shardCount = 3;
  let hash = 0;
  for (let i = 0; i < accountId.length; i++) {
    hash += accountId.charCodeAt(i);
  }
  return hash % shardCount;
}

module.exports = { getShard };

