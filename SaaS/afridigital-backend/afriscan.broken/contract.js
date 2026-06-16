module.exports = {
  core: [
    'afriscan/runtime/core/pipeline.js',
    'afriscan/truth/collector.js',
    'afriscan/utils/score.js'
  ],
  engine: [
    'afriscan/audit.engine.js'
  ],
  render: [
    'afriscan/renderer/cli.js',
    'afriscan/format/cliFormatter.js'
  ]
};
