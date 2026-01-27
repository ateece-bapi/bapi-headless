// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([...nextVitals, ...nextTs, {
  rules: {
    // Enforce JSDoc comments on public API functions
    // Only warns for exported function declarations and classes
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          ClassDeclaration: true,
          // Don't require for arrow functions (too noisy with TypeScript)
          ArrowFunctionExpression: false,
          FunctionExpression: false,
          MethodDefinition: false,
        },
        contexts: [
          // Only exported functions/classes
          'ExportNamedDeclaration > FunctionDeclaration',
          'ExportDefaultDeclaration > FunctionDeclaration',
          'ExportNamedDeclaration > ClassDeclaration',
        ],
        exemptEmptyFunctions: true,
        checkConstructors: false,
        enableFixer: false,
      },
    ],
    // Enforce JSDoc validity when present
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'off', // TypeScript handles this
    'jsdoc/check-param-names': 'warn',
    'jsdoc/require-param-type': 'off', // TypeScript handles this
    'jsdoc/require-returns-type': 'off', // TypeScript handles this
    'jsdoc/check-indentation': 'off', // Prettier handles this
  },
  plugins: ['jsdoc'],
}, // Override default ignores of eslint-config-next.
globalIgnores([
  // Default ignores of eslint-config-next:
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  // Ignore generated GraphQL file and tooling scripts that intentionally use CommonJS
  "src/lib/graphql/generated.ts",
  "scripts/preview_sanity.js",
]), ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
