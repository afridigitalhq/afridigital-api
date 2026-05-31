const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function scan(dir){
  const files = fs.readdirSync(dir);

  for(const f of files){
    const full = path.join(dir,f);
    const stat = fs.statSync(full);

    if(stat.isDirectory()) scan(full);

    if(full.endsWith('.js')){
      const c = fs.readFileSync(full,'utf8');

      const badPatterns = [
        /\.\.\/\.\.\/\.\.\/\.\.\/core\/kernel/g,
        /process\.cwd\(\).*kernel/g,
        /require\(['"]\.\.\/.*kernel\/config/g
      ];

      for(const p of badPatterns){
        if(p.test(c)){
          console.error('❌ KERNEL VIOLATION:', full);
          process.exit(1);
        }
      }
    }
  }
}

scan(path.join(root,'core'));
console.log('✔ KERNEL SAFE');
