const fs = require('fs');

const FILE = './queue.store.json';

// ensure file exists
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

const read = () => JSON.parse(fs.readFileSync(FILE));
const write = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

exports.add = (payload) => {
  const queue = read();
  queue.push({
    id: Date.now(),
    payload,
    status: 'pending'
  });
  write(queue);
};

exports.fetchPending = () => {
  return read().filter(j => j.status === 'pending');
};

exports.markDone = (id) => {
  const queue = read();
  const updated = queue.map(j =>
    j.id === id ? { ...j, status: 'done' } : j
  );
  write(updated);
};

exports.markFailed = (id) => {
  const queue = read();
  const updated = queue.map(j =>
    j.id === id ? { ...j, status: 'failed' } : j
  );
  write(updated);
};
