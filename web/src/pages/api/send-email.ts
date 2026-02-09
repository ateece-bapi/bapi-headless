import { NextApiRequest, NextApiResponse } from 'next';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { AppError, logError } from '@/lib/errors';

// Configure AWS SES
const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, subject, html, text } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = {
    Source: process.env.NEXT_PUBLIC_SENDER_EMAIL || 'no-reply@bapihvac.com', // Must be verified in SES
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        ...(text ? { Text: { Data: text } } : {}),
      },
    },
  };

  try {
      console.log('Attempting to send email with params:', JSON.stringify(params, null, 2));
      console.log('SES Client Config:', {
        region: process.env.AWS_SES_REGION,
        hasAccessKey: !!process.env.AWS_SES_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SES_SECRET_ACCESS_KEY,
      });
      
      const result = await ses.send(new SendEmailCommand(params));
      console.log('SES send result:', JSON.stringify(result, null, 2));
      
      return res.status(200).json({ success: true, messageId: result.MessageId });
    } catch (error) {
      logError(
        typeof error === 'string' ? error : JSON.stringify(error),
        'send-email API'
      );
      
      // Return detailed error for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ 
        error: 'Email delivery failed', 
        details: errorMessage 
      });
    }
}
