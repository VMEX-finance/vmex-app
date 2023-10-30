module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'react-hooks/exhaustive-deps': 'off',
        'no-var': 'error',
        'brace-style': 'error',
        'prefer-template': 'error',
        radix: 'error',
        'space-before-blocks': 'error',
        'import/prefer-default-export': 'off',
        'prettier/prettier': 'off',
        'no-unused-vars': 'off',
    },
    overrides: [
        {
            files: [
                '**/*.test.js',
                '**/*.test.jsx',
                '**/*.test.tsx',
                '**/*.spec.js',
                '**/*.spec.jsx',
                '**/*.spec.tsx',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
