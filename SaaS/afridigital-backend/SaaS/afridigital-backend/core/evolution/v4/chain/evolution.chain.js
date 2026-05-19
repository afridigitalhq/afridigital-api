/**
 * 🧊 IMMUTABLE EVOLUTION CHAIN (A3.17)
 * Each evolution becomes a cryptographically linked node
 */

const crypto = require("crypto");

const chain = [];

function hash(obj) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(obj))
    .digest("hex");
}

function addBlock(data) {

  const prev = chain[chain.length - 1];

  const block = {
    index: chain.length,
    ts: Date.now(),
    data,
    prevHash: prev ? prev.hash : "GENESIS",
    hash: null
  };

  block.hash = hash(block);
  chain.push(block);

  return block;
}

function getChain() {
  return chain;
}

module.exports = { addBlock, getChain };
