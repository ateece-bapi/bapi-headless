import { describe, expect, it } from 'vitest';
import { summarizeChatMetrics, type ChatAnalytics } from '../analytics';

const baseAnalytics: ChatAnalytics = {
  conversationId: 'conversation-1',
  timestamp: '2026-08-11T12:00:00.000Z',
  language: 'en',
  userMessage: 'Find a sensor',
  assistantResponse: 'Response',
  tokensUsed: 100,
  responseTimeMs: 1_000,
  outcome: 'success',
  toolIterations: 1,
  emptySearches: 0,
};

describe('chat metrics aggregation', () => {
  it('summarizes timeout, tool, empty-search, and unsupported-product metrics', () => {
    const metrics = summarizeChatMetrics([
      baseAnalytics,
      {
        ...baseAnalytics,
        conversationId: 'conversation-2',
        outcome: 'timeout',
        toolIterations: 2,
        emptySearches: 1,
        unsupportedProductCategories: ['current-sensors'],
      },
    ]);

    expect(metrics.timeoutCount).toBe(1);
    expect(metrics.timeoutRate).toBe(50);
    expect(metrics.averageToolIterations).toBe(1.5);
    expect(metrics.emptySearchCount).toBe(1);
    expect(metrics.unsupportedProductQuestions).toBe(1);
    expect(metrics.unsupportedProductBreakdown).toEqual({ 'current-sensors': 1 });
  });

  it('treats legacy analytics records as successful zero-tool interactions', () => {
    const legacyRecord = {
      ...baseAnalytics,
      outcome: undefined,
      toolIterations: undefined,
      emptySearches: undefined,
    } as unknown as ChatAnalytics;

    const metrics = summarizeChatMetrics([legacyRecord]);

    expect(metrics.timeoutRate).toBe(0);
    expect(metrics.averageToolIterations).toBe(0);
    expect(metrics.emptySearchCount).toBe(0);
  });
});
