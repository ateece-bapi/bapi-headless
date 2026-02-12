import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/lib/email/sendEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, subject, html, text, from } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  const result = await sendEmail({ to, subject, html, text, from });

  if (result.success) {
    return res.status(200).json({ success: true, messageId: result.messageId });
  } else {
    return res.status(500).json({
      error: 'Email delivery failed',
      details: result.error,
    });
  }
}
