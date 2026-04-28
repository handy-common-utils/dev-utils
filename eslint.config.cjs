const { buildESLintConfig, customiseESLintConfig } = require('@handy-common-utils/dev-dependencies-mocha');
const { defineConfig } = require('eslint/config');

const config = buildESLintConfig({ defaultSourceType: 'commonjs' });
customiseESLintConfig(
  config,
  (cfg) => [cfg.files].flat().some((f) => typeof f === 'string' && f.endsWith('*.ts')),
  (cfg) => {
    cfg.languageOptions.globals = {
      ...cfg.languageOptions.globals,
      BufferEncoding: 'readonly',
    };
  },
);

module.exports = defineConfig([
  {
    ignores: ['coverage/**/*', 'dist/**/*', 'api-docs/**/*'],
  },
  ...config,
]);
