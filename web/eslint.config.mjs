import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Enforce JSDoc comments on exported functions, classes, and types
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            'ExportNamedDeclaration',
            'ExportDefaultDeclaration',
          ],
        },
      ],
      // Optional: Enforce JSDoc validity
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-property-names': 'warn',
      'jsdoc/check-indentation': 'warn',
      'jsdoc/check-syntax': 'warn',
    },
    plugins: ['jsdoc'],
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore generated GraphQL file and tooling scripts that intentionally use CommonJS
    "src/lib/graphql/generated.ts",
    "scripts/preview_sanity.js",
  ]),
]);

export default eslintConfig;
