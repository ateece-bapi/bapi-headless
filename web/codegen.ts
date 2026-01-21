import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.json', // Using downloaded schema to avoid cache issues
  documents: 'src/**/*.{ts,tsx,graphql}',
  generates: {
    'src/lib/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        avoidOptionals: false,
        maybeValue: 'T | null | undefined',
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
};

export default config;
