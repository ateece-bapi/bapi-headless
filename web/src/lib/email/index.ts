/**
 * Email utilities and templates
 *
 * Centralized exports for email functionality
 */

export { generateChatHandoffEmail } from './templates/chatHandoff';
export { sendChatHandoffNotification } from './sendChatHandoffNotification';
export { generateQuoteSalesEmail, generateQuoteCustomerEmail } from './templates/quoteRequest';
export { sendEmail } from './sendEmail';
export type { SendEmailParams } from './sendEmail';
