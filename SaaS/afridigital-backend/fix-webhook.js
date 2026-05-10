const fs = require('fs');

let c = fs.readFileSync('server.js', 'utf8');

/**
 * Remove old webhook definition safely
 */
c = c.replace(/app\.post\(['"]\/webhook['"][\s\S]*?\n\}/g, '');

/**
 * Inject safe webhook BEFORE listen
 */
const safeWebhook = `
app.post('/webhook', async (req, res) => {
  try {
    res.sendStatus(200);

    setImmediate(async () => {
      try {
        const { webhook } = require('./core/webhooks/whatsapp.webhook');
        await webhook(req.body);
      } catch (err) {
        console.error('ASYNC WEBHOOK ERROR:', err);
      }
    });

  } catch (err) {
    console.error('WEBHOOK ENTRY ERROR:', err);
    res.sendStatus(200);
  }
});
`;

/**
 * Insert before listen block
 */
c = c.replace(
  /const PORT = process\.env\.PORT \|\| 10000;/,
  safeWebhook + '\n\nconst PORT = process.env.PORT || 10000;'
);

fs.writeFileSync('server.js', c);

console.log('🧠 V8.8 WEBHOOK PATCH COMPLETE');
