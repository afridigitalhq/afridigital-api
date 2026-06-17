const router = require('express').Router();
const dispatcher = require('../core/africore/runtime/dispatcher');

router.post('/runtime/dispatch', async (req,res)=>{
  try {
    const result = await dispatcher.dispatch(req.body);

    // 🚀 flatten response (IMPORTANT FIX)
    res.json(result);

  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e.message
    });
  }
});

module.exports = router;
