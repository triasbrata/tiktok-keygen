const { createWebpackAliases } = require('./webpack.helpers');

// Export aliases
module.exports = createWebpackAliases({
  '@assets': 'assets',
  '@components': 'src/renderer/components',
  '@common': 'src/common',
  '@share': 'src/share',
  // '@components': 'src/components',
  '@main': 'src/main',
  '@renderer': 'src/renderer',
  '@src': 'src',
  '@styles': 'src/renderer/styles',
});
