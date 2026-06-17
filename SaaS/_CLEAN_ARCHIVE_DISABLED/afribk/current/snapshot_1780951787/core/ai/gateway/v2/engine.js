const { selectProvider } = require('./router');

async function runStream({ text }) {
  const provider = selectProvider();
  return provider.generate({ text });
}

module.exports = { runStream };
