require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const runtimeRoutes = require('./routes/runtime');
const security = require('./middleware/security');
const app = express();
app.use(express.json({ limit:'2mb' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(security);
app.get('/',(_,res)=>{
  res.json({
    runtime: 'AfriCore Secure Runtime v1',
    status: 'ACTIVE',
    render: 'https://afridigital-fmdash.onrender.com'
  });
});
app.use('/api',runtimeRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log('🧠 AfriCore Secure Runtime ACTIVE on',PORT);
});
