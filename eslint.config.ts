import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import localRules from "./eslint-rules/no-hardcoded-colors.js";

export default defineConfig([
  {
    ignores: [
      "packages/*/dist/**/*",
      "packages/frontend/src/__generated__/**/*",
      "packages/backend/src/__generated__/**/*"
    ]
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'indent': 'off',
      '@stylistic/indent': ['error', 2],
    }
  },
  // backend eslint
  {
    files: ["packages/backend/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: {...globals.node} }
  },
  // frontend eslint
  {
    files: ['packages/frontend/src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      pluginReact,
      local: localRules,
    },
    extends: [

      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,

      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
    ],
    languageOptions: {

      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      }
    },
    rules: {
      'local/no-hardcoded-colors': 'error',
      'local/style-macro-inline-object': 'error',
    },
  },
  // frontend tooling/config files run in Node
  {
    files: [
      'packages/frontend/*.config.{js,mjs,cjs,ts,mts,cts}',
      'packages/frontend/vitest.config.ts',
      'packages/frontend/vitest.storybook.workspace.ts',
      'packages/frontend/.storybook/**/*.{js,mjs,cjs,ts,mts,cts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  // repository-level tooling/config files run in Node
  {
    files: [
      '.dependency-cruiser.cjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
