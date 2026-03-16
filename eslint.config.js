// ESLint Flat Config for a small browser JS project (snake-game)
// This file uses ESLint's flat config format (eslint.config.js).
// It intentionally avoids requiring extra ESLint plugins so it's ready to use
// with the project's existing devDependencies. To enable Prettier integration
// or other shareable configs, install and extend the relevant packages.

module.exports = [
  // ignore common folders
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.min.js']
  },

  // JS files rule set
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly'
      }
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      // Basic best-practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': ['warn', { destructuring: 'all' }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'multi-line'],
      'consistent-return': 'warn',

      // Allow console in a small game project; warn for debugger
      'no-console': 'off',
      'no-debugger': 'warn',

      // Stylistic (compatible with Prettier defaults; keep simple)
      'comma-dangle': ['error', 'only-multiline'],
      'semi': ['error', 'always']
    }
  }
];
