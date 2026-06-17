const fs = require('fs');

const file = './routes/ai.js';
let code = fs.readFileSync(file, 'utf8');

// ensure express router exists
if (!code.includes("express.Router")) {
  code = `
const express = require('express');
const router = express.Router();

router.post('/ai/reply', async (req,res)=>{
  return res.json({
    ok:true,
    message:"AI route alive",
    input:req.body
  });
});

module.exports = router;
`;
}

fs.writeFileSync(file, code);
console.log("🚀 AI ROUTE FIXED (router enforced)");
