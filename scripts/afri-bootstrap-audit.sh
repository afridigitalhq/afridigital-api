#!/data/data/com.termux/files/usr/bin/bash

echo "🧪 AFRIMONITOR BOOTSTRAP AUDIT"
echo "--------------------------------"

node afri-bootstrap-audit.mjs

echo "--------------------------------"
echo "🧪 IMPLEMENTATION STRUCTURE CHECK"

node -e "
import('fs').then(fs => {
  const base = 'src/afrimonitor/implementation';
  const dirs = fs.readdirSync(base);

  const report = dirs.map(d => {
    const files = fs.readdirSync(base + '/' + d);
    return { domain: d, files };
  });

  console.table(report);
});
"

echo "--------------------------------"
echo "🟢 AUDIT COMPLETE"
