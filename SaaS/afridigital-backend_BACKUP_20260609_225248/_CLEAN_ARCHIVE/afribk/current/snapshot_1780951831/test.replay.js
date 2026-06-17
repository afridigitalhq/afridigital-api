const w = require('./core/kernel/replay.bootstrap');

(async () => {

  console.log('\n🟢 SUCCESS');
  const r1 = await w.handleMessage({ text: 'hello', from: 'test' });
  console.log(JSON.stringify(r1, null, 2));

  console.log('\n🔴 FAILURE');
  const r2 = await w.handleMessage({ text: '__force_fail__', from: 'test' });
  console.log(JSON.stringify(r2, null, 2));

})();
