const express = require('express');
const app = express();

app.use(express.json());

// import routes safely later
module.exports = app;
