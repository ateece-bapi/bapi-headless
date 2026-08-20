import { beforeEach, describe, expect, it, vi } from 'vitest';

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return { ...actual, cache: <T extends (...args: never[]) => unknown>(callback: T) => callback };
});

vi.mock('@/lib/graphql/client', () => ({
  getGraphQLClient: () => ({ request }),
}));

vi.mock('@/lib/logger', () => ({
  default: { error: vi.fn() },
}));

import { getServiceBulletins } from './serviceBulletins.server';

function createNode(id: string) {
  return {
    id,
    title: `Bulletin ${id}`,
    slug: `bulletin-${id}`,
    date: '2026-08-20T12:00:00',
    modified: null,
    excerpt: null,
    serviceBulletinCategories: { nodes: [] },
  };
}

describe('Service Bulletin server data', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('traverses every GraphQL cursor page', async () => {
    request
      .mockResolvedValueOnce({
        serviceBulletins: {
          nodes: [createNode('1')],
          pageInfo: { hasNextPage: true, endCursor: 'next-cursor' },
        },
      })
      .mockResolvedValueOnce({
        serviceBulletins: {
          nodes: [createNode('2')],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      });

    const bulletins = await getServiceBulletins();

    expect(bulletins.map(({ id }) => id)).toEqual(['1', '2']);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[0][1]).toEqual({ first: 100, after: null });
    expect(request.mock.calls[1][1]).toEqual({ first: 100, after: 'next-cursor' });
  });
});
