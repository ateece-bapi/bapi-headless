/**
 * Send Chat Handoff Notification
 * 
 * Utility function to send email notifications when customers request human assistance
 */

import { generateChatHandoffEmail } from './templates/chatHandoff';
import { sendEmail } from './sendEmail';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SendChatHandoffNotificationParams {
  customerName: string;
  customerEmail: string;
  chatTranscript: ChatMessage[];
  customerPhone?: string;
  requestedTopic?: string;
  urgency?: 'low' | 'medium' | 'high';
  recipientEmail?: string; // Sales team email, defaults to environment variable
}

/**
 * Send a chat handoff notification email to the sales team
 * 
 * @param params - Chat handoff parameters
 * @returns Promise with send result
 */
export async function sendChatHandoffNotification(params: SendChatHandoffNotificationParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const {
    customerName,
    customerEmail,
    chatTranscript,
    customerPhone,
    requestedTopic,
    urgency = 'medium',
    recipientEmail = process.env.NEXT_PUBLIC_SALES_EMAIL || 'sales@bapisensors.com',
  } = params;

  try {
    // Generate email template
    const { subject, html, text } = generateChatHandoffEmail({
      customerName,
      customerEmail,
      chatTranscript,
      customerPhone,
      requestedTopic,
      urgency,
    });

    // Send email directly via SES
    const result = await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
    });

    return result;
  } catch (error) {
    console.error('Failed to send chat handoff notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
