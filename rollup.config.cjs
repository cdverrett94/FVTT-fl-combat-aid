const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = () => ({
  input: 'src/module/fl-combat-aid.js',
  output: {
    dir: 'dist/module',
    format: 'es',
    sourcemap: true,
  },
  plugins: [nodeResolve()],
});