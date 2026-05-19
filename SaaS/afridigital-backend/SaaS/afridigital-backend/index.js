const app = require('./server');
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log('🚀 AFRI UNIFIED SERVER ON', PORT));
