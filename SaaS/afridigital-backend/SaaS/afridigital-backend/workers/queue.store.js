const fs = require('fs');
const path = './storage/queue.json';

if (!fs.existsSync('./storage')) {
  fs.mkdirSync('./storage');
}

const load = () => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return [];
  }
};

const save = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

exports.push = (job) => {
  const queue = load();
  queue.push({ job, retries: 0, time: Date.now() });
  save(queue);
};

exports.popAll = () => {
  const queue = load();
  save([]);
  return queue;
};

exports.save = save;
