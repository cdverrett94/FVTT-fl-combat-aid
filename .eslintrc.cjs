module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  env: {
    browser: true,
    jquery: true,
    node: true,
  },

  extends: ['eslint:recommended', '@typhonjs-fvtt/eslint-config-foundry.js/0.8.0', 'plugin:prettier/recommended'],

  plugins: [],

  rules: {
    // Specify any specific ESLint rules.
  },

  overrides: [
    {
      files: ['./*.js', './*.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
