const express = require('express');

const app = express();

app.use(express.json());

const { boot } = require('./core/bootstrap/v8.kernel');

boot(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 V8 SERVER RUNNING ON PORT', PORT);
});
