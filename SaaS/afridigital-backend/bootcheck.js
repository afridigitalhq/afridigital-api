console.log('🧠 SERVER BOOT OK');
const app=require('./server');
if(typeof app!=='function') throw new Error('INVALID EXPRESS APP EXPORT');
