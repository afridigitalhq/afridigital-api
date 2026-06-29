const required = ['API_URL','FRONTEND_URL'];

const missing = required.filter(k => !process.env[k]);

if (missing.length) {
  console.log('❌ Missing ENV:', missing.join(', '));
  process.exit(1);
}

console.log('🟢 ENV OK');
