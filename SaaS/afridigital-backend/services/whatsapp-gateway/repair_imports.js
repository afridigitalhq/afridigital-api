const fs = require('fs');

const f = './server.js';
let c = fs.readFileSync(f, 'utf8');

const imports = `
const express = require('express');
`;

if (!c.includes("const express = require('express')")) {
  c = imports + '\n' + c;
}

fs.writeFileSync(f, c);

console.log('🧠 EXPRESS IMPORT RESTORED');
