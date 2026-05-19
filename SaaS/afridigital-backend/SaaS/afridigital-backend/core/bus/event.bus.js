const { assertApiVersion } = require("../runtime/safety/api.guard");
const { normalize } = require('./job.contract');
const fs = require('fs');

const FILE = './queue.bus.json';
const LOCK = './queue.bus.lock';

if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');

const read = () => JSON.parse(fs.readFileSync(FILE));
const write = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// atomic lock simulation
const lock = () => {
  while (fs.existsSync(LOCK)) {}
  fs.writeFileSync(LOCK, '1');
};

const unlock = () => fs.unlinkSync(LOCK);

exports.publish = (event) => {
  lock();
  const bus = read();
  undefined
  write(bus);
  unlock();
};

exports.consume = () => {
  lock();
  const bus = read();
  const pending = bus.filter(e => e.status === 'pending');
  unlock();
  return pending;
};

exports.commit = (id) => {
  lock();
  const bus = read();
  const updated = bus.map(e =>
    e.id === id ? { ...e, status: 'done' } : e
  );
  write(updated);
  unlock();
};
