/**
 * Quote Request Email Templates
 *
 * Sends notifications when customers submit quote requests
 */

interface QuoteProduct {
  name: string;
  quantity: number;
  partNumber?: string;
}

interface QuoteRequestEmailData {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  products: QuoteProduct[];
  notes?: string;
  requestDate: string;
}

/**
 * Generate email for sales team (internal notification)
 */
export function generateQuoteSalesEmail(data: QuoteRequestEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const {
    quoteId,
    customerName,
    customerEmail,
    customerPhone,
    companyName,
    products,
    notes,
    requestDate,
  } = data;

  const subject = `[New Quote] ${quoteId} - ${customerName}${companyName ? ` (${companyName})` : ''}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
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
                📋 New Quote Request
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 14px;">
                Quote ID: <strong>${quoteId}</strong>
              </p>
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
                  <td style="padding: 10px;">
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
                  companyName
                    ? `
                <tr>
                  <td style="padding: 10px;">
                    <strong style="color: #374151;">Company:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${companyName}</span>
                  </td>
                </tr>
                `
                    : ''
                }
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; border-radius: 6px;">
                    <strong style="color: #374151;">Request Date:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${new Date(
                      requestDate
                    ).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Products -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Requested Products
              </h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #1479BC; color: #ffffff;">
                    <th style="padding: 12px; text-align: left; font-size: 14px;">Product</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${products
                    .map(
                      (product, index) => `
                    <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #ffffff;' : ''}">
                      <td style="padding: 12px;">
                        <strong style="color: #1f2937; font-size: 14px;">${product.name}</strong>
                        ${product.partNumber ? `<br><span style="color: #6b7280; font-size: 12px;">Part #: ${product.partNumber}</span>` : ''}
                      </td>
                      <td style="padding: 12px; text-align: center; color: #1f2937; font-weight: bold;">
                        ${product.quantity}
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </td>
          </tr>

          ${
            notes
              ? `
          <!-- Notes -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Additional Notes
              </h2>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px;">
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                  ${notes.replace(/\n/g, '<br>')}
                </p>
              </div>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Action Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="mailto:${customerEmail}?subject=Re:%20Quote%20Request%20${quoteId}" 
                 style="display: inline-block; background: linear-gradient(135deg, #1479BC 0%, #0d5a94 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(20, 121, 188, 0.3);">
                📧 Reply to Customer
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This is an automated notification from the BAPI website quote system.
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
NEW QUOTE REQUEST - ${quoteId}

Customer Information:
- Name: ${customerName}
- Email: ${customerEmail}
${customerPhone ? `- Phone: ${customerPhone}` : ''}
${companyName ? `- Company: ${companyName}` : ''}
- Request Date: ${new Date(requestDate).toLocaleString()}

Requested Products:
${products.map((p) => `- ${p.name}${p.partNumber ? ` (Part #: ${p.partNumber})` : ''} - Qty: ${p.quantity}`).join('\n')}

${notes ? `Additional Notes:\n${notes}` : ''}

Reply to: ${customerEmail}
`;

  return { subject, html, text };
}

/**
 * Generate confirmation email for customer
 */
export function generateQuoteCustomerEmail(data: QuoteRequestEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { quoteId, customerName, products, requestDate } = data;

  const subject = `Quote Request Received - ${quoteId}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Request Confirmation</title>
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
                ✅ Quote Request Received
              </h1>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi ${customerName},
              </p>
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Thank you for your quote request! We've received your inquiry and our sales team will review it shortly.
              </p>
              <div style="background-color: #eff6ff; border-left: 4px solid #1479BC; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #1e40af; font-weight: bold;">
                  Quote ID: ${quoteId}
                </p>
                <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                  Reference this ID in all communications
                </p>
              </div>
            </td>
          </tr>

          <!-- Products Summary -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Your Request Summary
              </h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #e5e7eb; color: #1f2937;">
                    <th style="padding: 12px; text-align: left; font-size: 14px;">Product</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${products
                    .map(
                      (product, index) => `
                    <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #ffffff;' : ''}">
                      <td style="padding: 12px;">
                        <span style="color: #1f2937; font-size: 14px;">${product.name}</span>
                        ${product.partNumber ? `<br><span style="color: #6b7280; font-size: 12px;">Part #: ${product.partNumber}</span>` : ''}
                      </td>
                      <td style="padding: 12px; text-align: center; color: #1f2937; font-weight: bold;">
                        ${product.quantity}
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                What Happens Next?
              </h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                  <li>Our sales team will review your request</li>
                  <li>We'll prepare a detailed quote with pricing and availability</li>
                  <li>You'll receive the quote via email within 1-2 business days</li>
                  <li>We're available to answer any questions you may have</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #FFC843; padding: 16px; border-radius: 6px;">
                <p style="margin: 0 0 8px 0; color: #78350f; font-weight: bold; font-size: 14px;">
                  Need immediate assistance?
                </p>
                <p style="margin: 0; color: #78350f; font-size: 14px;">
                  Contact our sales team at <a href="mailto:customerservice@bapisensors.com" style="color: #1479BC; text-decoration: none;">customerservice@bapisensors.com</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                BAPI - Building Automation Products, Inc.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                750 North Royal Avenue, Gays Mills, WI 54631
              </p>
              <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">
                <a href="https://www.bapihvac.com" style="color: #1479BC; text-decoration: none;">www.bapihvac.com</a>
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
QUOTE REQUEST CONFIRMATION

Hi ${customerName},

Thank you for your quote request! We've received your inquiry and our sales team will review it shortly.

Quote ID: ${quoteId}
Reference this ID in all communications.

YOUR REQUEST SUMMARY:
${products.map((p) => `- ${p.name}${p.partNumber ? ` (Part #: ${p.partNumber})` : ''} - Qty: ${p.quantity}`).join('\n')}

WHAT HAPPENS NEXT?
1. Our sales team will review your request
2. We'll prepare a detailed quote with pricing and availability
3. You'll receive the quote via email within 1-2 business days
4. We're available to answer any questions you may have

Need immediate assistance?
Contact our sales team at customerservice@bapisensors.com

BAPI - Building Automation Products, Inc.
750 North Royal Avenue, Gays Mills, WI 54631
www.bapihvac.com
`;

  return { subject, html, text };
}
