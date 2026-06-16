const collector = require('./runtime/core/truth/collector');
const pipeline = require('./runtime/core/observatory.v3.7');
const { render } = require('./ui/observatory.renderer');

function run() {
  const data = collector();
  const out = render(data); console.log(out); return out;
}

module.exports = run;
