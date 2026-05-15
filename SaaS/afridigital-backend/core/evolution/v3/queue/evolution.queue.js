/**
 * 📬 EVOLUTION QUEUE (ADMIN INBOX BACKEND)
 */

const queue = [];

function addProposal(p) {
  queue.push(p);
  if (queue.length > 3) queue.shift(); // keep only 3 active
}

function getQueue() {
  return queue;
}

function removeProposal(id) {
  const idx = queue.findIndex(p => p.id === id);
  if (idx !== -1) queue.splice(idx, 1);
}

module.exports = {
  addProposal,
  getQueue,
  removeProposal
};
