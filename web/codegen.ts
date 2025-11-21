import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql',
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
