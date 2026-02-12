/**
 * Chat Handoff Email Template
 *
 * Sends notification to sales team when a customer requests to speak with a human
 */

interface ChatHandoffEmailData {
  customerName: string;
  customerEmail: string;
  chatTranscript: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  customerPhone?: string;
  requestedTopic?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export function generateChatHandoffEmail(data: ChatHandoffEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const {
    customerName,
    customerEmail,
    chatTranscript,
    customerPhone,
    requestedTopic,
    urgency = 'medium',
  } = data;

  const urgencyColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  const urgencyLabels = {
    low: 'Standard',
    medium: 'Moderate',
    high: 'Urgent',
  };

  const subject = `[${urgencyLabels[urgency]}] Chat Handoff Request - ${customerName}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Handoff Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1479BC 0%, #0d5a94 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🤝 Chat Handoff Request
              </h1>
            </td>
          </tr>

          <!-- Urgency Banner -->
          <tr>
            <td style="padding: 0;">
              <div style="background-color: ${urgencyColors[urgency]}; color: #ffffff; text-align: center; padding: 12px; font-weight: bold; font-size: 14px;">
                ⚡ Priority: ${urgencyLabels[urgency].toUpperCase()}
              </div>
            </td>
          </tr>

          <!-- Customer Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Customer Information
              </h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                    <strong style="color: #374151;">Name:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${customerName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #ffffff;">
                    <strong style="color: #374151;">Email:</strong>
                    <a href="mailto:${customerEmail}" style="color: #1479BC; margin-left: 8px; text-decoration: none;">${customerEmail}</a>
                  </td>
                </tr>
                ${
                  customerPhone
                    ? `
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                    <strong style="color: #374151;">Phone:</strong>
                    <a href="tel:${customerPhone}" style="color: #1479BC; margin-left: 8px; text-decoration: none;">${customerPhone}</a>
                  </td>
                </tr>
                `
                    : ''
                }
                ${
                  requestedTopic
                    ? `
                <tr>
                  <td style="padding: 10px; background-color: #ffffff;">
                    <strong style="color: #374151;">Topic:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${requestedTopic}</span>
                  </td>
                </tr>
                `
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- Chat Transcript -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Chat Transcript
              </h2>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; max-height: 400px; overflow-y: auto;">
                ${chatTranscript
                  .map(
                    (message) => `
                  <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <span style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background-color: ${message.role === 'user' ? '#1479BC' : '#FFC843'}; color: #ffffff; text-align: center; line-height: 32px; font-weight: bold; margin-right: 12px;">
                        ${message.role === 'user' ? '👤' : '🤖'}
                      </span>
                      <div>
                        <strong style="color: #1f2937; font-size: 14px;">
                          ${message.role === 'user' ? customerName : 'AI Assistant'}
                        </strong>
                        <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">
                          ${new Date(message.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div style="color: #374151; font-size: 14px; line-height: 1.6; margin-left: 44px;">
                      ${message.content.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="mailto:${customerEmail}?subject=Re:%20Your%20BAPI%20Inquiry" 
                 style="display: inline-block; background: linear-gradient(135deg, #1479BC 0%, #0d5a94 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(20, 121, 188, 0.3);">
                📧 Reply to Customer
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                This is an automated notification from the BAPI Chat System<br>
                <strong style="color: #1479BC;">Building Automation Products, Inc.</strong><br>
                <a href="https://bapihvac.com" style="color: #1479BC; text-decoration: none;">bapihvac.com</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #9ca3af; font-size: 11px;">
                Sent: ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
CHAT HANDOFF REQUEST - ${urgencyLabels[urgency].toUpperCase()} PRIORITY

Customer Information:
- Name: ${customerName}
- Email: ${customerEmail}
${customerPhone ? `- Phone: ${customerPhone}` : ''}
${requestedTopic ? `- Topic: ${requestedTopic}` : ''}

Chat Transcript:
${chatTranscript
  .map(
    (msg) => `
[${new Date(msg.timestamp).toLocaleString()}] ${msg.role === 'user' ? customerName : 'AI Assistant'}:
${msg.content}
`
  )
  .join('\n')}

---
Reply to customer: ${customerEmail}
BAPI Chat System - Building Automation Products, Inc.
https://bapihvac.com
  `;

  return { subject, html, text };
}
