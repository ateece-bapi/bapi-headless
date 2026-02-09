/**
 * Shared Email Sending Function
 * 
 * Uses AWS SES to send emails. Can be called from API routes or server components.
 */

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logError } from '@/lib/errors';

// Configure AWS SES
const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
  },
});

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Send an email via AWS SES
 */
export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { to, subject, html, text, from } = params;

  if (!to || !subject || !html) {
    return {
      success: false,
      error: 'Missing required fields: to, subject, html',
    };
  }

  const toAddresses = Array.isArray(to) ? to : [to];
  const source = from || process.env.NEXT_PUBLIC_SENDER_EMAIL || 'no-reply@bapihvac.com';

  const sesParams = {
    Source: source,
    Destination: { ToAddresses: toAddresses },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        ...(text ? { Text: { Data: text } } : {}),
      },
    },
  };

  try {
    console.log('Sending email via SES:', {
      to: toAddresses,
      subject,
      from: source,
    });

    const result = await ses.send(new SendEmailCommand(sesParams));

    console.log('Email sent successfully:', {
      messageId: result.MessageId,
      to: toAddresses,
    });

    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logError(
      `Failed to send email: ${errorMessage}`,
      'sendEmail'
    );

    console.error('SES send error:', {
      error: errorMessage,
      to: toAddresses,
      subject,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}
