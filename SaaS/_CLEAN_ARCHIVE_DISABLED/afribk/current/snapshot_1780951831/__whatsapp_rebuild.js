const fs = require('fs');
const path = './core/ai/gateway/v5/plugins/whatsapp/kernelAdapter.js';

// backup first
fs.writeFileSync(path + '.backup', fs.readFileSync(path, 'utf8'));

// clean module (safe literal string, no bash parsing risk)
const clean = `

async function handleStreamingWhatsApp(body = {}) {
  const text = (body && body.text) ? body.text : '';

  const words = text.split(' ');
  let acc = '';
  const chunks = [];

  for (let i = 0; i < words.length; i++) {
    acc += (i === 0 ? '' : ' ') + words[i];

    chunks.push({
      type: i === words.length - 1 ? 'final' : 'chunk',
      text: acc
    });
  }

  return {
    ok: true,
    reply: '[MOCK]' + text,
    provider: 'mock',
    streamed: true,
    chunks,
    final: acc
  };
}

async function lightweightStream(text = '') {
  const words = text.split(' ');
  let acc = '';
  const chunks = [];

  for (let i = 0; i < words.length; i++) {
    acc += (i === 0 ? '' : ' ') + words[i];

    chunks.push({
      type: i === words.length - 1 ? 'final' : 'chunk',
      text: acc
    });
  }

  return { stream: true, chunks, final: acc };
}

module.exports = {
  handleStreamingWhatsApp,
  lightweightStream
};
`;

fs.writeFileSync(path, clean);

// verify syntax
require('child_process').execSync('node -c ' + path);

console.log('🚀 WhatsApp kernel rebuilt safely (FILE MODE)');
