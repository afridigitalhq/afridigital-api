const fs = require('fs');

const file = 'routes/ai.js';
let code = fs.readFileSync(file, 'utf8');

// remove old ai route
code = code.replace(/router\.post\('\/ai'[\s\S]*?\}\)\s*\)?;/g, '');

// inject safe wrapper
const safeRoute = `
router.post('/ai', async (req, res) => {
  try {
    const kernel = require('../core/africore/runtime/kernel');

    if (!kernel || typeof kernel.run !== 'function') {
      return res.status(500).json({ ok:false, error:'Kernel not ready' });
    }

    const payload = {
      from: req.body.user,
      message: req.body.text,
      traceId: Date.now().toString()
    };

    const result = await Promise.race([
      kernel.run(payload),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Kernel timeout')), 10000)
      )
    ]);

    return res.json({ ok:true, result });

  } catch (e) {
    return res.status(500).json({ ok:false, error:e.message });
  }
});
`;

code += safeRoute;

fs.writeFileSync(file, code);

console.log("🚀 AI ROUTE PATCHED SAFELY");
