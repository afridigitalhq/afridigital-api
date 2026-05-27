import express from 'express';
import paystackRoutes from './routes/paystackRoutes.js';
const app = express();
app.use(express.json());
app.use('/api/paystack', paystackRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
