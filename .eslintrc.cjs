module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 2018
    },
    env: {
        node: true,
        es6: true,
        jest: true
    },
    rules: {
        'prettier/prettier': 'warn',
        eqeqeq: "warn",
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-empty-function": ["off"],
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/no-var-requires": ["off"]
    },
};