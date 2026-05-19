
/**
 * 🚀 CLEAN A3.18.30 STABLE SERVER
 */

const express = require('express');
const bodyParser = require('body-parser');

const { ingestWebhook, startLiveBrain } = require('./core/runtime/server/live.bridge');

const app = express();
app.use(bodyParser.json({ verify: (req,res,buf)=>{ req.rawBody = buf.toString(); }}));

startLiveBrain();

/**
 * WEBHOOK
 */
app.post('/webhook/whatsapp', (req, res) => {
  return ingestWebhook(req, res);
});

/**
 * HEALTH
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

if (require.main === module) {
  
  });
}

if (require.main === module) {
  
  });
}


const PORT = process.env.PORT || 10000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 AFRIDIGITAL LIVE ON PORT', PORT);
  });
}
