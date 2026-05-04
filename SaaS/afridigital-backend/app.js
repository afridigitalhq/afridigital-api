import express from 'express';
import paystackRoutes from './routes/paystackRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/paystack', paystackRoutes);
const PORT = process.env.PORT || 5000;
app.get('/go/:service',(req,res)=>{const map={hfm:'https://hfm.com/?refid=YOUR_ID'};const s=req.params.service;if(map[s]){console.log('OUTBOUND',s,req.ip,Date.now());res.redirect(map[s])}else{res.status(404).send('Unknown service')}});
app.listen(PORT, () => console.log('Server running on port', PORT));
