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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">
          {error || 'Failed to load analytics'}
        </p>
        <button
          onClick={fetchMetrics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const satisfactionRate =
    metrics.positiveFeedback + metrics.negativeFeedback > 0
      ? Math.round(
          (metrics.positiveFeedback /
            (metrics.positiveFeedback + metrics.negativeFeedback)) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Conversations */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium">
                Total Conversations
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {metrics.totalConversations.toLocaleString()}
              </p>
            </div>
            <div className="bg-primary-100 rounded-lg p-3">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium">
                Avg Response Time
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {(metrics.averageResponseTime / 1000).toFixed(2)}s
              </p>
            </div>
            <div className="bg-accent-100 rounded-lg p-3">
              <Clock className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        {/* Satisfaction Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium">
                Satisfaction Rate
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {satisfactionRate}%
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {metrics.positiveFeedback} 👍 / {metrics.negativeFeedback} 👎
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium">
                Estimated Cost
              </p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                ${metrics.estimatedCost.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {metrics.totalTokensUsed.toLocaleString()} tokens
              </p>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3">
              <DollarSign className="w-6 h-6 text-neutral-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" />
            Language Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.languageBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700 uppercase">
                    {lang}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${(count / metrics.totalConversations) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-neutral-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-accent-500" />
            Most Recommended Products
          </h3>
          {metrics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {metrics.topProducts.slice(0, 8).map((product, index) => (
                <div
                  key={product.slug}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-400 w-6">
                      #{index + 1}
                    </span>
                    <a
                      href={`/en/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-500 hover:text-primary-600 hover:underline"
                    >
                      {product.slug}
                    </a>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {product.count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No product recommendations yet
            </p>
          )}
        </div>
      </div>

      {/* Tool Usage */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">
          Tool Usage Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(metrics.toolUsage).map(([tool, count]) => (
            <div
              key={tool}
              className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
            >
              <p className="text-sm text-neutral-600">{tool}</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {count}
              </p>
            </div>
          ))}
          {Object.keys(metrics.toolUsage).length === 0 && (
            <p className="text-neutral-500 col-span-3 text-center py-4">
              No tool usage recorded yet
            </p>
          )}
        </div>
      </div>

      {/* Feedback Details */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">
          User Feedback Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {metrics.positiveFeedback}
              </p>
              <p className="text-sm text-neutral-600">Positive Feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-red-100 rounded-full p-4">
              <ThumbsDown className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">
                {metrics.negativeFeedback}
              </p>
              <p className="text-sm text-neutral-600">Negative Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
