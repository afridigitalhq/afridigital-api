/**
 * KERNEL IMPORT GUARD v4 (SAFE ISOLATION MODE)
 */

const fs = require('fs');
const path = require('path');

function scanDir(dir, violations = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    // NEVER scan kernel itself (prevents self-trigger loops)
    if (full.includes('/core/kernel/')) continue;

    if (entry.isDirectory()) {
      scanDir(full, violations);
      continue;
    }

    if (!entry.name.endsWith('.js')) continue;

    const content = fs.readFileSync(full, 'utf8');

    // RULE 1: hard kernel bypass detection
    if (content.includes('../../../../core/kernel/')) {
      violations.push(full);
    }

    // RULE 2: plugin-level config bypass restriction
    if (
      full.includes('/plugins/') &&
      content.includes('core/kernel/config')
    ) {
      violations.push(full);
    }
  }

  return violations;
}

function scan() {
  const root = path.join(process.cwd(), 'core');
  const violations = scanDir(root);

  if (violations.length) {
    console.error('❌ KERNEL VIOLATIONS DETECTED');
    violations.forEach(v => console.error(' -', v));
    process.exit(1);
  }

  console.log('✔ Kernel clean');
}

module.exports = { scan };
