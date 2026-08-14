import { redirect } from 'next/navigation';

/** Redirects the legacy nonlocalized URL to the canonical catalog route. */
export default function CatalogPricebookRedirect() {
  redirect('/en/catalogpricebook');
}