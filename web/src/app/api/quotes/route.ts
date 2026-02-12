import { NextRequest, NextResponse } from 'next/server';
import { getServerAuth } from '@/lib/auth/server';
import logger from '@/lib/logger';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sendEmail, generateQuoteSalesEmail, generateQuoteCustomerEmail } from '@/lib/email';

// Type definitions
interface QuoteRequestData {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  productName: string;
  partNumber: string;
  quantity: string;
  application: string;
  timeline: string;
  details: string;
  companyName: string;
  phoneNumber: string;
  attachments: string[];
  status: 'pending';
  submittedAt: string;
  updatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getServerAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();

    // Extract form fields
    const subject = formData.get('subject') as string;
    const productName = formData.get('productName') as string;
    const partNumber = formData.get('partNumber') as string;
    const quantity = formData.get('quantity') as string;
    const application = formData.get('application') as string;
    const timeline = formData.get('timeline') as string;
    const details = formData.get('details') as string;
    const companyName = formData.get('companyName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const userEmail = formData.get('userEmail') as string;

    // Validate required fields
    if (
      !subject ||
      !productName ||
      !quantity ||
      !application ||
      !timeline ||
      !details ||
      !companyName ||
      !phoneNumber
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle file uploads
    const files = formData.getAll('files') as File[];
    const attachments: string[] = [];

    if (files.length > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'quotes');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Save each file
      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const timestamp = Date.now();
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${timestamp}_${sanitizedName}`;
          const filepath = path.join(uploadsDir, filename);

          await writeFile(filepath, buffer);
          attachments.push(`/uploads/quotes/${filename}`);
        }
      }
    }

    // Create quote request object
    const quoteId = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const now = new Date().toISOString();

    const quoteRequest: QuoteRequestData = {
      id: quoteId,
      userId,
      userEmail,
      subject,
      productName,
      partNumber,
      quantity,
      application,
      timeline,
      details,
      companyName,
      phoneNumber,
      attachments,
      status: 'pending',
      submittedAt: now,
      updatedAt: now,
    };

    // For now, save to a JSON file (will upgrade to database later)
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const quotesFile = path.join(dataDir, 'quotes.json');
    let quotes: QuoteRequestData[] = [];

    if (existsSync(quotesFile)) {
      const { readFile } = await import('fs/promises');
      const data = await readFile(quotesFile, 'utf-8');
      quotes = JSON.parse(data);
    }

    quotes.push(quoteRequest);
    await writeFile(quotesFile, JSON.stringify(quotes, null, 2));

    // Send email notifications
    const emailData = {
      quoteId,
      customerName: companyName || userEmail.split('@')[0],
      customerEmail: userEmail,
      customerPhone: phoneNumber,
      companyName,
      products: [
        {
          name: productName,
          quantity: parseInt(quantity) || 1,
          partNumber,
        },
      ],
      notes: `Subject: ${subject}\n\nApplication: ${application}\nTimeline: ${timeline}\n\nDetails:\n${details}`,
      requestDate: now,
    };

    // Send notification to sales team
    const salesEmail = generateQuoteSalesEmail(emailData);
    const salesRecipient = process.env.NEXT_PUBLIC_SALES_EMAIL || 'customerservice@bapisensors.com';

    const salesResult = await sendEmail({
      to: salesRecipient,
      subject: salesEmail.subject,
      html: salesEmail.html,
      text: salesEmail.text,
    });

    if (!salesResult.success) {
      logger.error('Failed to send sales team quote notification', {
        error: salesResult.error,
        quoteId,
      });
    } else {
      logger.info('Quote notification sent to sales team', {
        quoteId,
        messageId: salesResult.messageId,
      });
    }

    // Send confirmation to customer
    const customerEmail = generateQuoteCustomerEmail(emailData);

    const customerResult = await sendEmail({
      to: userEmail,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    });

    if (!customerResult.success) {
      logger.error('Failed to send customer quote confirmation', {
        error: customerResult.error,
        quoteId,
      });
    } else {
      logger.info('Quote confirmation sent to customer', {
        quoteId,
        messageId: customerResult.messageId,
      });
    }

    return NextResponse.json({
      success: true,
      quoteId,
      message: 'Quote request submitted successfully',
      emailsSent: {
        sales: salesResult.success,
        customer: customerResult.success,
      },
    });
  } catch (error) {
    logger.error('Error submitting quote request', error);
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getServerAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read quotes from file
    const quotesFile = path.join(process.cwd(), 'data', 'quotes.json');

    if (!existsSync(quotesFile)) {
      return NextResponse.json({ quotes: [] });
    }

    const { readFile } = await import('fs/promises');
    const data = await readFile(quotesFile, 'utf-8');
    const allQuotes: QuoteRequestData[] = JSON.parse(data);

    // Filter quotes for current user
    const userQuotes = allQuotes.filter((quote) => quote.userId === userId);

    // Sort by submission date (newest first)
    userQuotes.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({ quotes: userQuotes });
  } catch (error) {
    logger.error('Error fetching quotes', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
