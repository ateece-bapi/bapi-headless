'use client';

import { useEffect, useState } from 'react';
import {
  MessageCircle,
  TrendingUp,
  DollarSign,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Package,
  Zap,
} from 'lucide-react';
import type { ChatMetricsSummary } from '@/lib/chat/analytics';

export default function ChatAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<ChatMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/chat/analytics?view=metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error || 'Failed to load analytics'}</p>
        <button
          onClick={fetchMetrics}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const satisfactionRate =
    metrics.positiveFeedback + metrics.negativeFeedback > 0
      ? Math.round(
          (metrics.positiveFeedback / (metrics.positiveFeedback + metrics.negativeFeedback)) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Conversations */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Conversations</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {metrics.totalConversations.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-primary-100 p-3">
              <MessageCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Avg Response Time</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {(metrics.averageResponseTime / 1000).toFixed(2)}s
              </p>
            </div>
            <div className="rounded-lg bg-accent-100 p-3">
              <Clock className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        {/* Satisfaction Rate */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Satisfaction Rate</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{satisfactionRate}%</p>
              <p className="mt-1 text-xs text-neutral-500">
                {metrics.positiveFeedback} 👍 / {metrics.negativeFeedback} 👎
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Estimated Cost</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                ${metrics.estimatedCost.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {metrics.totalTokensUsed.toLocaleString()} tokens
              </p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-3">
              <DollarSign className="h-6 w-6 text-neutral-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Breakdown & Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Language Breakdown */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
            <Zap className="h-5 w-5 text-primary-500" />
            Language Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.languageBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase text-neutral-700">{lang}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-neutral-200">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{
                          width: `${(count / metrics.totalConversations) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm text-neutral-600">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
            <Package className="h-5 w-5 text-accent-500" />
            Most Recommended Products
          </h3>
          {metrics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {metrics.topProducts.slice(0, 8).map((product, index) => (
                <div key={product.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-neutral-400">#{index + 1}</span>
                    <a
                      href={`/en/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-500 hover:text-primary-600 hover:underline"
                    >
                      {product.slug}
                    </a>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{product.count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-neutral-500">No product recommendations yet</p>
          )}
        </div>
      </div>

      {/* Tool Usage */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-neutral-900">Tool Usage Statistics</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(metrics.toolUsage).map(([tool, count]) => (
            <div key={tool} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-600">{tool}</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{count}</p>
            </div>
          ))}
          {Object.keys(metrics.toolUsage).length === 0 && (
            <p className="col-span-3 py-4 text-center text-neutral-500">
              No tool usage recorded yet
            </p>
          )}
        </div>
      </div>

      {/* Feedback Details */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-neutral-900">User Feedback Breakdown</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-4">
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{metrics.positiveFeedback}</p>
              <p className="text-sm text-neutral-600">Positive Feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-4">
              <ThumbsDown className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{metrics.negativeFeedback}</p>
              <p className="text-sm text-neutral-600">Negative Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
