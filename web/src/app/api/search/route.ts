import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const SEARCH_QUERY = `
  query SearchProducts($search: String!) {
    products(where: { search: $search, visibility: VISIBLE }, first: 8) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          shortDescription
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          price
          shortDescription
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: { nodes: [] } });
    }

    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    if (!GRAPHQL_ENDPOINT) {
      logger.error('NEXT_PUBLIC_WORDPRESS_GRAPHQL not configured');
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { search: query },
      }),
      next: { revalidate: 0 }, // Don't cache search results
    });

    if (!response.ok) {
      logger.error('WordPress GraphQL search failed', { 
        status: response.status,
        statusText: response.statusText 
      });
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      logger.error('GraphQL search query failed', { errors: data.errors });
      return NextResponse.json(
        { error: 'GraphQL query failed', details: data.errors },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data);
  } catch (error) {
    logger.error('Search API error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
