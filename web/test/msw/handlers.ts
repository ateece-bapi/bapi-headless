import { graphql, HttpResponse } from 'msw';
import { getProductQuerySchema } from '@/lib/validation/product';
import { mockProduct } from './fixtures';

// MSW v2 GraphQL handler - explicitly type the response as GraphQL data envelope
export const handlers = [
  graphql.query('GetProductBySlug', () => {
    const payload = { product: mockProduct };
    // Validate the overall shape to satisfy types and document expectations
    getProductQuerySchema.parse(payload);
    
    // Return GraphQL response with data envelope
    return HttpResponse.json({
      data: payload,
    });
  }),
];
