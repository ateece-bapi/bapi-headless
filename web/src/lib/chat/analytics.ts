/**
 * Chat Analytics & Logging System
 *
 * Tracks conversation metrics, product recommendations, and user feedback
 * for continuous improvement of the AI chatbot.
 */

import { promises as fs } from 'fs';
import path from 'path';
import logger from '@/lib/logger';

export interface ChatAnalytics {
  conversationId: string;
  timestamp: string;
  language: string;
  userMessage: string;
  assistantResponse: string;
  productsRecommended?: string[]; // Product slugs
  toolsUsed?: string[]; // e.g., ['search_products']
  tokensUsed: number;
  responseTimeMs: number;
  outcome?: 'success' | 'timeout' | 'error' | 'tool_limit';
  toolIterations?: number;
  emptySearches?: number;
  unsupportedProductCategories?: string[];
  feedback?: 'positive' | 'negative';
  feedbackComment?: string;
}

export interface ChatMetricsSummary {
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  estimatedCost: number; // USD
  languageBreakdown: Record<string, number>;
  topProducts: Array<{ slug: string; count: number }>;
  positiveFeedback: number;
  negativeFeedback: number;
  toolUsage: Record<string, number>;
  timeoutCount: number;
  timeoutRate: number;
  averageToolIterations: number;
  emptySearchCount: number;
  unsupportedProductQuestions: number;
  unsupportedProductBreakdown: Record<string, number>;
}

const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'chat-analytics');
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'conversations.jsonl'); // JSONL for append-only logs

/**
 * Ensures analytics directory exists
 */
async function ensureAnalyticsDir() {
  try {
    await fs.mkdir(ANALYTICS_DIR, { recursive: true });
  } catch (error) {
    logger.error('Failed to create analytics directory', error);
  }
}

/**
 * Logs a chat interaction to JSONL file (append-only for performance)
 */
export async function logChatAnalytics(analytics: ChatAnalytics): Promise<void> {
  logger.info('Chat reliability metric', {
    conversationId: analytics.conversationId,
    outcome: analytics.outcome ?? 'success',
    responseTimeMs: analytics.responseTimeMs,
    toolIterations: analytics.toolIterations ?? 0,
    emptySearches: analytics.emptySearches ?? 0,
    unsupportedProductCategories: analytics.unsupportedProductCategories,
  });

  try {
    await ensureAnalyticsDir();
    const logLine = JSON.stringify(analytics) + '\n';
    await fs.appendFile(ANALYTICS_FILE, logLine, 'utf8');
  } catch (error) {
    logger.error('Failed to log chat analytics', error);
    // Don't throw - analytics failure shouldn't break chat
  }
}

/** Aggregates stored chat events into dashboard metrics. */
export function summarizeChatMetrics(conversations: ChatAnalytics[]): ChatMetricsSummary {
  const languageBreakdown: Record<string, number> = {};
  const productCounts: Record<string, number> = {};
  const toolUsage: Record<string, number> = {};
  const unsupportedProductBreakdown: Record<string, number> = {};
  let totalResponseTime = 0;
  let totalTokens = 0;
  let positiveFeedback = 0;
  let negativeFeedback = 0;
  let timeoutCount = 0;
  let totalToolIterations = 0;
  let emptySearchCount = 0;
  let unsupportedProductQuestions = 0;

  conversations.forEach((conv) => {
    languageBreakdown[conv.language] = (languageBreakdown[conv.language] || 0) + 1;

    conv.productsRecommended?.forEach((slug) => {
      productCounts[slug] = (productCounts[slug] || 0) + 1;
    });

    conv.toolsUsed?.forEach((tool) => {
      toolUsage[tool] = (toolUsage[tool] || 0) + 1;
    });

    totalResponseTime += conv.responseTimeMs;
    totalTokens += conv.tokensUsed;
    totalToolIterations += conv.toolIterations ?? 0;
    emptySearchCount += conv.emptySearches ?? 0;

    if (conv.outcome === 'timeout') timeoutCount++;
    if (conv.feedback === 'positive') positiveFeedback++;
    if (conv.feedback === 'negative') negativeFeedback++;

    if (conv.unsupportedProductCategories?.length) {
      unsupportedProductQuestions++;
      conv.unsupportedProductCategories.forEach((category) => {
        unsupportedProductBreakdown[category] = (unsupportedProductBreakdown[category] || 0) + 1;
      });
    }
  });

  const topProducts = Object.entries(productCounts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const conversationCount = conversations.length;

  return {
    totalConversations: conversationCount,
    totalMessages: conversationCount,
    averageResponseTime: conversationCount > 0 ? totalResponseTime / conversationCount : 0,
    totalTokensUsed: totalTokens,
    estimatedCost: (totalTokens / 1_000_000) * 0.75,
    languageBreakdown,
    topProducts,
    positiveFeedback,
    negativeFeedback,
    toolUsage,
    timeoutCount,
    timeoutRate: conversationCount > 0 ? (timeoutCount / conversationCount) * 100 : 0,
    averageToolIterations: conversationCount > 0 ? totalToolIterations / conversationCount : 0,
    emptySearchCount,
    unsupportedProductQuestions,
    unsupportedProductBreakdown,
  };
}

/**
 * Updates feedback for a specific conversation
 */
export async function updateChatFeedback(
  conversationId: string,
  feedback: 'positive' | 'negative',
  comment?: string
): Promise<void> {
  try {
    await ensureAnalyticsDir();

    // Read all logs
    const fileContent = await fs.readFile(ANALYTICS_FILE, 'utf8').catch(() => '');
    const lines = fileContent.split('\n').filter(Boolean);

    // Update matching conversation
    const updatedLines = lines.map((line) => {
      const entry: ChatAnalytics = JSON.parse(line);
      if (entry.conversationId === conversationId) {
        entry.feedback = feedback;
        if (comment) entry.feedbackComment = comment;
      }
      return JSON.stringify(entry);
    });

    // Write back
    await fs.writeFile(ANALYTICS_FILE, updatedLines.join('\n') + '\n', 'utf8');
  } catch (error) {
    logger.error('Failed to update feedback', error);
  }
}

/**
 * Gets chat metrics summary for dashboard
 */
export async function getChatMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<ChatMetricsSummary> {
  try {
    await ensureAnalyticsDir();

    const fileContent = await fs.readFile(ANALYTICS_FILE, 'utf8').catch(() => '');
    const lines = fileContent.split('\n').filter(Boolean);

    // Parse all conversations
    let conversations = lines.map((line) => JSON.parse(line) as ChatAnalytics);

    // Filter by date range if provided
    if (startDate || endDate) {
      conversations = conversations.filter((conv) => {
        const convDate = new Date(conv.timestamp);
        if (startDate && convDate < startDate) return false;
        if (endDate && convDate > endDate) return false;
        return true;
      });
    }

    return summarizeChatMetrics(conversations);
  } catch (error) {
    logger.error('Failed to get chat metrics', error);
    // Return empty metrics on error
    return {
      totalConversations: 0,
      totalMessages: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0,
      estimatedCost: 0,
      languageBreakdown: {},
      topProducts: [],
      positiveFeedback: 0,
      negativeFeedback: 0,
      toolUsage: {},
      timeoutCount: 0,
      timeoutRate: 0,
      averageToolIterations: 0,
      emptySearchCount: 0,
      unsupportedProductQuestions: 0,
      unsupportedProductBreakdown: {},
    };
  }
}

/**
 * Gets recent conversations for debugging/review
 */
export async function getRecentConversations(limit: number = 50): Promise<ChatAnalytics[]> {
  try {
    await ensureAnalyticsDir();

    const fileContent = await fs.readFile(ANALYTICS_FILE, 'utf8').catch(() => '');
    const lines = fileContent.split('\n').filter(Boolean);

    // Get last N conversations
    const recentLines = lines.slice(-limit);
    return recentLines.map((line) => JSON.parse(line) as ChatAnalytics).reverse();
  } catch (error) {
    logger.error('Failed to get recent conversations', error);
    return [];
  }
}

/**
 * Gets conversations with negative feedback for review
 */
export async function getNegativeFeedbackConversations(): Promise<ChatAnalytics[]> {
  try {
    await ensureAnalyticsDir();

    const fileContent = await fs.readFile(ANALYTICS_FILE, 'utf8').catch(() => '');
    const lines = fileContent.split('\n').filter(Boolean);

    const conversations = lines.map((line) => JSON.parse(line) as ChatAnalytics);
    return conversations.filter((conv) => conv.feedback === 'negative').reverse();
  } catch (error) {
    logger.error('Failed to get negative feedback', error);
    return [];
  }
}
