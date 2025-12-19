// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:@convex-dev/recommended',
  ],
  ignorePatterns: ['node_modules/**', 'dist/**', 'build/**'],
};
