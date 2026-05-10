const fs = require('fs');

const FILE = './dead.letter.json';

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, '[]');
}

const read = () => JSON.parse(fs.readFileSync(FILE));
const write = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

exports.push = (job) => {
  const data = read();
  data.push(job);
  write(data);
};

exports.getAll = () => read();
