const app = require('./server.app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 CLEAN SERVER RUNNING ON', PORT);
});

module.exports = app;
