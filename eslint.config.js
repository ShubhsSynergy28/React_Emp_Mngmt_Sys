import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"] 
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.es2020
      } 
    } 
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {  // Moved react settings to proper settings object
      react: {
        version: 'detect'
      }
    }
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      "arrow-body-style": ["error", "always"],
      "no-irregular-whitespace": 'warn',
      "no-unreachable": "error",
      "no-duplicate-imports": ["error", { "includeExports": true }],
      // Recommended additional rules for React/TypeScript:
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      'react/no-unescaped-entities': ['error', {
        forbid: ['>', '}'] // Only check for these potentially problematic chars
      }]
    }
  }
]);