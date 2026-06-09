const fs = require('fs');

const p = './core/whatsapp/controller/index.js';

let c = fs.readFileSync(p, 'utf8');

/* SAFE OUTCOME WRAPPER (NO INLINE TEMPLATE HELL) */
const injection =
`
// AUTO-INJECTED OUTCOME ENFORCER
const outcome = classifyOutcome({ flow: result.flow, result, intent });

return {
  ok: outcome.type === 'success',
  flow: result.flow,
  attempt: 1,
  result,
  outcome,
  replay: outcome.replay || false
};
`;

/* SAFE REPLACEMENT */
if (c.includes('return result;')) {
  c = c.replace(/return result;/g, injection + '\nreturn result;');
  fs.writeFileSync(p, c);
  console.log('🧠 OUTCOME PATCH APPLIED SAFELY');
} else {
  console.log('⚠️ No return result; found - manual review needed');
}
