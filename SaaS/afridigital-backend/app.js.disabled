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

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server running on port', PORT);
});


const whatsappWebhook = require('./routes/whatsapp.webhook');
app.use('/', whatsappWebhook);

console.log('🔥 WHATSAPP WEBHOOK MOUNTED');
