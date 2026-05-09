const express = require('express');
const app = express();

const paystackRoutes = require('./routes/paystackRoutes');
const loadModules = require('./modules-loader');

app.use(express.json());

loadModules(app);

const whatsappRoutes = require("./routes/whatsapp");
app.use("/", whatsappRoutes);

app.use('/api/paystack', paystackRoutes);

const chatModule = require('./modules/chat');
const paymentsModule = require('./modules/payments');
const aiModule = require('./modules/ai-engine');
const dashboardModule = require('./modules/dashboard');

app.use('/modules/chat', chatModule);
app.use('/modules/payments', paymentsModule);
app.use('/modules/ai', aiModule);
app.use('/modules/dashboard', dashboardModule);

app.get('/go/:service', (req, res) => {
  const map = {
    hfm: 'https://hfm.com/?refid=YOUR_ID'
  };

  const s = req.params.service;

  if (map[s]) {
    console.log('OUTBOUND', s, req.ip, Date.now());
    res.redirect(map[s]);
  } else {
    res.status(404).send('Unknown service');
  }
});

app.get('/', (req, res) => {
  res.send('🚀 AfriDigital Backend Online');
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
});
