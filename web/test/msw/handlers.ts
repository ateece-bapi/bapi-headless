import { graphql } from 'msw';
import { getProductQuerySchema } from '@/lib/validation/product';
import { mockProduct } from './fixtures';

// Use MSW's inferred resolver type to ensure correct function signature.
type GraphQLResolver = Parameters<typeof graphql.query>[1];

const getProductResolver: GraphQLResolver = (req, res, ctx) => {
  const payload = { product: mockProduct };
  // Validate the overall shape to satisfy types and document expectations
  getProductQuerySchema.parse(payload);
  return res(ctx.data(payload));
};

export const handlers = [graphql.query('GetProductBySlug', getProductResolver)];
