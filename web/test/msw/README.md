# MSW fixtures and handlers

Conventions for writing and using MSW fixtures and handlers in tests:

- Place test HTTP/GraphQL fixtures and handlers under `web/test/msw/`.
- Export concrete fixtures (e.g. `mockProduct`) and test-friendly client shapes (e.g. `mockProductForClient`) from `fixtures.ts`.
- Validate server-shaped fixtures at module load using Zod (see `productSchema.parse(...)`) so mistakes are caught early during test startup.
- Use typed MSW resolvers to avoid `any` in handler signatures. Example:

```ts
type GraphQLResolver = Parameters<typeof graphql.query>[1];
const resolver: GraphQLResolver = (req, res, ctx) => { ... };
```

- Prefer importing shared fixtures in tests to avoid duplicated mock shapes. Use the `make*` factory helpers when tests need small overrides.
- Keep handler payloads validated with the corresponding Zod schema before returning `res(ctx.data(...))`.

If you update GraphQL shapes, update `web/src/lib/validation/*` Zod schemas and the fixtures accordingly.
