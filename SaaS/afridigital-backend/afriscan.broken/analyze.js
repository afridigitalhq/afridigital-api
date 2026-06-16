const fs = require('fs');

function analyze(files) {
  let listenHits = 0;
  let expressHits = 0;

  for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');

    listenHits += (c.match(/app\.listen/g) || []).length;
    expressHits += (c.match(/express/g) || []).length;
  }

  return {
    totalFiles: files.length,
    listenHits,
    expressHits,
    tree: { _files: files.slice(0, 200) }
  };
}

module.exports = analyze;
