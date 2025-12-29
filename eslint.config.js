import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat';
import convexPlugin from '@convex-dev/eslint-plugin';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },

  ...convexPlugin.configs.recommended,
]);
