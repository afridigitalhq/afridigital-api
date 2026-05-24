
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
  override: true
});

console.log('=== ROOT ENV CHECK ===');
console.log({
  META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
  META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID
});

require('./SaaS/afridigital-backend/SaaS/afridigital-backend/server.js');
