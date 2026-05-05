import express from 'express';
import paystackRoutes from './routes/paystackRoutes.js';
const app = express();

const loadModules = require('./modules-loader');
loadModules(app);

app.use(express.json());
app.use('/api/paystack', paystackRoutes);
const PORT = process.env.PORT || 5000;
app.get('/go/:service',(req,res)=>{const map={hfm:'https://hfm.com/?refid=YOUR_ID'};const s=req.params.service;if(map[s]){console.log('OUTBOUND',s,req.ip,Date.now());res.redirect(map[s])}else{res.status(404).send('Unknown service')}});
app.listen(PORT, () => console.log('Server running on port', PORT));

// ===== AfriDigital Modules =====
const chatModule = require('./modules/chat');
const paymentsModule = require('./modules/payments');
const aiModule = require('./modules/ai-engine');
const dashboardModule = require('./modules/dashboard');

// Module Routes
app.use('/modules/chat', chatModule);
app.use('/modules/payments', paymentsModule);
app.use('/modules/ai', aiModule);
app.use('/modules/dashboard', dashboardModule);

