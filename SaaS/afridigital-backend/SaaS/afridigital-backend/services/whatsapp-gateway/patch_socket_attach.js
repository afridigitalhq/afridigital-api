const fs = require('fs');

const f = './server.js';
let c = fs.readFileSync(f, 'utf8');

if (!c.includes('attachSocket')) {

  c =
`const { attachSocket } = require('./core/stream/socket.bridge');
` + c;

  c = c.replace(
    /app\.listen\(([\s\S]*?)\);/,
`const server = app.listen($1);

attachSocket(server);`
  );
}

fs.writeFileSync(f, c);

console.log('🚀 SOCKET BRIDGE ATTACHED');
