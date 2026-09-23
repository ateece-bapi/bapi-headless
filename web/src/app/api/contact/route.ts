import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { sendEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * POST - Submit the public contact form
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name as string)?.trim();
    const email = (body.email as string)?.trim();
    const company = (body.company as string)?.trim();
    const phone = (body.phone as string)?.trim();
    const subject = (body.subject as string)?.trim();
    const message = (body.message as string)?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const recipient = process.env.NEXT_PUBLIC_SALES_EMAIL || 'customerservice@bapisensors.com';
    const text = [
      `Name: ${name}`,
      company && `Company: ${company}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      `Subject: ${subject}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
    `;

    const result = await sendEmail({
      to: recipient,
      subject: `Contact form: ${subject}`,
      html,
      text,
    });

    if (!result.success) {
      logger.error('Failed to send contact form email', { error: result.error });
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for reaching out. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    logger.error('Contact form API error', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
